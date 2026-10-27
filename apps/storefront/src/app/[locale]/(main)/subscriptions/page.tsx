import{notFound}from"next/navigation"
import{isValidLocale}from"@/lib/i18n"
import{SubscriptionPlans}from"@/components/account/subscription-plans"
export default async function Page({params}:{params:Promise<{locale:string}>}){const{locale}=await params;if(!isValidLocale(locale))notFound();return <SubscriptionPlans locale={locale}/>}
