import type { Manifest } from 'manifesto.js';
import type { AnnotationBody, User } from '@annotorious/core';
import type { ImageAnnotationTarget } from '@annotorious/annotorious';
import * as Y from 'yjs';

export interface Cursor {

  color: string;

  name: string;

  pos: number[];

  typing?: boolean;

}

export interface IIIFManifest {

  type: 'MANIFEST';

  majorVersion: number;

  parsed: Manifest;

  raw: any;

}

export interface IIIFImage {
  
  type: 'IMAGE';

  majorVersion: number;

  url: string;

  id: string;

  raw: any;

}

export type IIIFContent = IIIFManifest | IIIFImage;

export type ManifestLoadError = 'fetch_error' | 'parse_error' | 'unsupported_format';

export interface ManifestValidationSuccess {

  isValid: true;

  content: IIIFContent;

  label?: string;

  thumbnail?: string;

  pages?: number;

}

export interface ManifestValidationFailure {
  
  isValid: false;

  error: 'invalid_url' | 'not_https' | 'fetch_error' | 'invalid_manifest' | 'unsupported_manifest_type';

}

export type ManifestValidationResult = ManifestValidationSuccess | ManifestValidationFailure;

export interface RoomRecord {

  id: string;

  iiif_content: string;

  iiif_type: 'IMAGE' | 'MANIFEST';

  major_version: number;

  thumbnail?: string;

  pages?: number;

  name?: string;

  created: string;

  owner?: string;

  time_limit_hours?: number;

  paused_at?: string;

  expires_at: string;

  is_private?: boolean;

  is_readonly?: boolean;

}

export interface Room extends Omit<RoomRecord, 'created' | 'owner'> {

  created: Date;

  owner?: User;

}

export interface AccessedRoom extends Room {

  last_accessed?: Date;

  permission?: 'approved' | 'declined';

}

export interface MyProfileInformation {
  
  me: User;
  
  quotas: ProfileQuotas;

}

export interface ProfileQuotas {

  user_id: string;

  permanent_rooms_limit: number;

  annotations_limit?: number;

  annotations_used?: number;

} 

export interface Subscription {

  user_id: string;

  plan_type: 'PRO';

  paddle_customer_id: string;

  paddle_subscription_id: string;

  paddle_subscription_status: string;

  paddle_product_name: string;

  paddle_product_id: string;

  paddle_price_id: string;

  started_at: string;

  updated_at: string;

}

export interface SubscriptionManagementData {

  cancel: string;

  firstBilledAt: string | null;

  nextBilledAt: string | null;

  updatePaymentMethod: string | null;

}

export type Tool = 'move' | 'rectangle' | 'polygon' | 'ellipse' | 'path' | 'intelligent-scissors';

export interface PresentUser extends User {

  canvas: string;

  color: string; 

}

export interface UserPresence {

  after: PresentUser[];
  
  before: PresentUser[];

  onThisCanvas: PresentUser[];

}

export interface UserAwarenessState extends PresentUser {

  cursor?: [number, number];

  isTyping?: boolean;

  selected?: string[];

  timestamp: string;

}

export type YJSAnnotation = Y.Array<YJSAnnotationBody |   YJSImageAnnotationTarget>;

export interface YJSAnnotationBody extends Omit<AnnotationBody, 'created' | 'updated'> {

  created: string;

  updated: string;

}

export interface YJSImageAnnotationTarget extends Omit<ImageAnnotationTarget, 'created' | 'updated'> {

  created: string;

  updated: string;
  
}

