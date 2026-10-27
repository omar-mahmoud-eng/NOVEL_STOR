"use client"
import NextImage,{type ImageProps}from"next/image"
// Loopback media is public to the browser, but localhost inside the storefront
// container points at a different service. Let the browser fetch those files.
export default function MediaImage(props:ImageProps){const local=typeof props.src==="string"&&/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(props.src);return <NextImage {...props} unoptimized={props.unoptimized??local}/>}
