import { useEffect, useState } from 'react';
import { Utils, Manifest } from 'manifesto.js';
import type { 
  IIIFImage, 
  IIIFManifest, 
  ManifestValidationFailure, 
  ManifestValidationResult, 
  ManifestValidationSuccess 
} from '../types';

/** Basic RegEx URL plausibility check **/
const isPlausibleURL = (str: string) => {
  if (!str.startsWith('https://'))
    return false;

  const pattern = 
    new RegExp('^https:\\/\\/' + // HTTPS protocol
     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
     '((\\d{1,3}\\.){3}\\d{1,3}))'); // OR ip (v4) address

  return pattern.test(str);
}

export const isSupportedManifest = (manifest: Manifest) => {
  if (!manifest.getSequences() || manifest.getSequences().length !== 1)
    return false;

  const canvases = manifest.getSequences()[0].getCanvases();

  // Require a list of canvases, with length > 0
  if (!canvases || !Array.isArray(canvases) || canvases.length === 0)
    return false;

  return true;
}

export const getMajorVersion = (data: any, type: 'presentation' | 'image') => {
  const context = data['@context'];

  const iiifContext = context ? (
    Array.isArray(context) ? (
      context.find(str => str.includes(`api/${type}`))
    ) : typeof context === 'string' ? context : undefined
  ) : undefined;

  return iiifContext.includes(`iiif.io/api/${type}/2`) ? 2 :
    iiifContext.includes(`iiif.io/api/${type}/3`) ? 3 : undefined;
}

export const isImageManifestURL = (url: string) =>
  url.endsWith('info.json') || url.includes('info.json?');

export const parseImageInfo = (url: string, data: any) => {
  const id = data['@id'] || data.id;

  const majorVersion = getMajorVersion(data, 'image');
  if (majorVersion) {
    return {
      id,
      url,
      type: 'IMAGE',
      majorVersion,
      raw: data
    } as IIIFImage;
  }
}

export const parseManifest = (data: any) => {
  const manifest = Utils.parseManifest(data) as Manifest;

  if (manifest && isSupportedManifest(manifest)) {
    const majorVersion = getMajorVersion(data, 'presentation');

    if (majorVersion) {
      return {
        type: 'MANIFEST',
        majorVersion,
        parsed: manifest,
        raw: data 
      } as IIIFManifest;
    }
  }
}

/** Validation state machine **/
const validateManifest = (url: string): Promise<ManifestValidationResult> => {
  if (isPlausibleURL(url)) {
    return fetch(url)
      .then(response => response.json())
      .then(data => {
          try {
            if (isImageManifestURL(url)) {
              const content = parseImageInfo(url, data);
              if (data) {
                return {
                  isValid: true,
                  content
                } as ManifestValidationSuccess;
              } else {
                return {
                  isValid: false,
                  error: 'unsupported_manifest_type'
                } as ManifestValidationFailure;  
              }              
            } else {
              const content = parseManifest(data);

              if (content) {
                return {
                  isValid: true,
                  label: content.parsed.getDefaultLabel(),
                  pages: content.parsed.getSequences()[0].getCanvases().length || 0,
                  content
                } as ManifestValidationSuccess;
              } else {
                return {
                  isValid: false,
                  error: 'unsupported_manifest_type'
                } as ManifestValidationFailure;
              }
            }
          } catch (error) {
            // Exception during parse - return the error
            console.error(error);
            return {
              isValid: false,
              error: 'invalid_manifest'
            } as ManifestValidationResult;
          }
        })
        .catch(error => {
          console.error(error);
          return {
            isValid: false,
            error: 'fetch_error'
          };
        });
  } else {
    return Promise.resolve({
      isValid: false,
      error: url.startsWith('https') ? 'invalid_url' : 'not_https'
    });
  } 
}

export const useManifestValidation = (url?: string) => {

  const [isFetching, setIsFetching] = useState(false);

  const [lastResult, setLastResult] = useState<ManifestValidationResult | undefined>();

  useEffect(() => {
    if (!url) {
      // Reset
      setIsFetching(false);
      setLastResult(undefined);
    } else {
      setIsFetching(true);
      setLastResult(undefined);

      validateManifest(url).then(result => {
        setLastResult(result);
        setIsFetching(false);
      });
    }
  }, [url])

  return {
    isFetching,
    result: lastResult
  }

}