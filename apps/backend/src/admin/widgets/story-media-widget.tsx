import React from "react"
import {defineWidgetConfig} from "@medusajs/admin-sdk"
import {ProductStoryEditor} from "../components/product-story-editor"
export default function StoryMediaWidget({data}:{data:{id:string}}){return <ProductStoryEditor productId={data.id}/>}
export const config=defineWidgetConfig({zone:"product.details.after"})
