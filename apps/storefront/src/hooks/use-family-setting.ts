"use client"
import { useCustomerAuth } from "@/context/customer-auth-context"
import { useLocalSetting } from "./use-local-setting"
export function useFamilySetting<T>(key:string,fallback:T){const {customer}=useCustomerAuth();return useLocalSetting(`${key}${customer?`.${customer.id}`:""}`,fallback)}
