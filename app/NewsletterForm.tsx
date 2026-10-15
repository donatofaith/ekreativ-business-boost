"use client";
import { FormEvent, useState } from "react";
export default function NewsletterForm() {
 const [email,setEmail]=useState(""); const [consent,setConsent]=useState(false); const [website,setWebsite]=useState("");
 const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle"); const [message,setMessage]=useState("");
 async function handleSubmit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(status==="loading")return;setStatus("loading");setMessage("");
  try{const response=await fetch("/api/newsletter",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,consent,website})});const result=await response.json();if(!response.ok)throw new Error(result?.message||"We couldn’t add you right now. Please try again.");setStatus("success");setMessage("You’re on the list. Thanks for subscribing!");setEmail("");setConsent(false);}
  catch(error){setStatus("error");setMessage(error instanceof Error?error.message:"Something went wrong. Please try again.");}}
 return <form className="studio-newsletter-form" onSubmit={handleSubmit}>
  <label htmlFor="newsletter-email">Email address</label><div className="studio-newsletter-fields">
   <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254}/>
   <button type="submit" disabled={status==="loading"||!consent}>{status==="loading"?"Joining…":"Join the list"} <span aria-hidden="true">↗</span></button></div>
  <label className="studio-newsletter-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required/><span>I agree to receive occasional emails from Eximius Kreativ Solutions. I can unsubscribe at any time.</span></label>
  <div className="studio-newsletter-honeypot" aria-hidden="true"><label htmlFor="newsletter-website">Leave this field empty</label><input id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></div>
  {message&&<p className={`studio-newsletter-message ${status}`} role="status">{message}</p>}
 </form>;
}