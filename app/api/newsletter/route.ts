import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
export const runtime = "nodejs";
function validEmail(email:string){return email.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}
export async function POST(request:NextRequest){
 try{
  const body=await request.json();const email=typeof body?.email==="string"?body.email.trim().toLowerCase():"";
  const consent=body?.consent===true;const honeypot=typeof body?.website==="string"?body.website.trim():"";
  if(honeypot)return NextResponse.json({success:true});
  if(!validEmail(email))return NextResponse.json({success:false,message:"Enter a valid email address."},{status:400});
  if(!consent)return NextResponse.json({success:false,message:"Please agree to receive emails before subscribing."},{status:400});
  const {error}=await supabaseAdmin.from("newsletter_subscribers").upsert({email,consent:true,consent_source:"website_newsletter",subscribed_at:new Date().toISOString(),unsubscribed_at:null},{onConflict:"email"});
  if(error){console.error("Newsletter subscription failed:",error.message);return NextResponse.json({success:false,message:"We couldn’t save your subscription just now. Please try again later."},{status:500});}
  return NextResponse.json({success:true,message:"Subscription saved."});
 }catch{return NextResponse.json({success:false,message:"We couldn’t process your request. Please try again."},{status:400});}
}