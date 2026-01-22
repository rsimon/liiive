export const wrapImageInfo = (url: string) => {
  if (!url || !url.includes('/info.json'))
    throw new Error(`Invalid info.json URL: ${url}`);

  // TODO support options later
  const manifestId = `${url.replace(/\/info\.json$/, '')}/manifest`;
  const label = 'liiive Image';

  return fetch(url).then(res => res.json()).then(info => {
    const canvasId = `${manifestId}/canvas/1`;

    const context = info['@context'] || info.context;
    if (!context) {
      console.error(info);
      throw new Error(`No context found in info.json`);
    }

    const serviceType = context.includes('image/3') ? 'ImageService3' : 'ImageService2';

    const imageService = {
      id: info.id || info['@id'],
      type: serviceType,
      profile: info.profile
    };

    const width = info.width;
    const height = info.height;

    return {
      "@context": "http://iiif.io/api/presentation/3/context.json",
      "id": manifestId,
      "type": "Manifest",
      "label": { "en": [label] },
      "items": [
        {
          "id": canvasId,
          "type": "Canvas",
          "height": height,
          "width": width,
          "label": { "en": [label] },
          "items": [
            {
              "id": `${canvasId}/page`,
              "type": "AnnotationPage",
              "items": [
                {
                  "id": `${canvasId}/page/annotation/1`,
                  "type": "Annotation",
                  "motivation": "painting",
                  "body": {
                    "id": `${imageService.id}/full/max/0/default.jpg`,
                    "type": "Image",
                    "format": "image/jpeg",
                    "height": height,
                    "width": width,
                    "service": [imageService]
                  },
                  "target": canvasId
                }
              ]
            }
          ]
        }
      ]
    };
  });
}