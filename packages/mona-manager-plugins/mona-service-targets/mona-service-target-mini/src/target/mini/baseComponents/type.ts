import {
  ButtonProps,
  ViewProps,
  ProgressProps,
  IconProps,
  ScrollViewProps,
  SwiperProps,
  SwiperItemProps,
  MovableAreaProps,
  MovableViewProps,
  CheckboxProps,
  CheckboxGroupProps,
  FormProps,
  InputProps,
  LabelProps,
  AllPickerProps,
  PickerViewProps,
  PickerViewColumnProps,
  RadioProps,
  RadioGroupProps,
  SliderProps,
  SwitchProps,
  TextareaProps,
  NavigatorProps,
  ImageProps,
  VideoProps,
  LivePlayerProps,
  CameraProps,
  CanvasProps,
  MapProps,
  WebviewProps,
  AdProps,
  OpenDataProps,
  LinkProps,
  TextProps,
  RichTextProps,
  MemberButtonProps,
  CouponCardProps,
  ProductFollowButtonProps,
  SkuButtonProps,
  ShopFollowCardProps,
} from '@bytedance/mona';

type Alias = string;
type AliasMap<T, V = Alias> = Record<keyof T, V>;
export type ViewAlias = AliasMap<ViewProps>;
export type ButtonAlias = AliasMap<ButtonProps>;
export type ProgressAlias = AliasMap<ProgressProps>;
export type IconAlias = AliasMap<IconProps>;
export type ScrollViewAlias = AliasMap<ScrollViewProps>;
export type SwiperAlias = AliasMap<SwiperProps>;
export type SwiperItemAlias = AliasMap<SwiperItemProps>;
export type MovableAreaAlias = AliasMap<MovableAreaProps>;
export type MovableViewAlias = AliasMap<MovableViewProps>;
export type CheckboxAlias = AliasMap<CheckboxProps>;
export type CheckboxGroupAlias = AliasMap<CheckboxGroupProps>;
export type FormAlias = AliasMap<FormProps>;
export type InputAlias = AliasMap<InputProps>;
export type LabelAlias = AliasMap<LabelProps>;
export type PickerAlias = AliasMap<AllPickerProps>;
export type PickerViewAlias = AliasMap<PickerViewProps>;
export type PickerViewColumnAlias = AliasMap<PickerViewColumnProps>;
export type RadioAlias = AliasMap<RadioProps>;
export type RadioGroupAlias = AliasMap<RadioGroupProps>;
export type SliderAlias = AliasMap<SliderProps>;
export type SwitchAlias = AliasMap<SwitchProps>;
export type TextareaAlias = AliasMap<TextareaProps>;
export type NavigatorAlias = AliasMap<NavigatorProps>;
export type ImageAlias = AliasMap<ImageProps>;
export type VideoAlias = AliasMap<VideoProps>;
export type LivePlayerAlias = AliasMap<LivePlayerProps>;
export type CameraAlias = AliasMap<CameraProps>;
export type CanvasAlias = AliasMap<CanvasProps>;
export type MapAlias = AliasMap<MapProps>;
export type WebviewAlias = AliasMap<WebviewProps>;
export type AdAlias = AliasMap<AdProps>;
export type OpenDataAlias = AliasMap<OpenDataProps>;
export type LinkAlias = AliasMap<LinkProps>;
export type TextAlias = AliasMap<TextProps>;
export type RichTextAlias = AliasMap<RichTextProps>;
export type MemberButtonAlias = AliasMap<MemberButtonProps>;
export type CouponCardAlias = AliasMap<CouponCardProps>;
export type ProductFollowButtonAlias = AliasMap<ProductFollowButtonProps>;
export type SkuButtonAlias = AliasMap<SkuButtonProps>;
export type ShopFollowCardAlias = AliasMap<ShopFollowCardProps>;
