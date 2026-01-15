export default async function validatePromoCode(code, userId) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-promo-code`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` // هنا حطينا الـ env key
      },
      body: JSON.stringify({ code, userId })
    }
  )

  const result = await response.json()
  return result
}
// دلوقت يسطا الفانكشن ده بتروح لل ايدج فانكشن ف السوبا بيز وبتاخد اليوزر اي دي والبروموكود اللي هوا دخله وبعد كدهربتدور في جدول البروموكودز ف السوبا بيز وترجع نتيجه 
// عباره عن نوع البروموكود وصلاحيته وشكل النتايج بتاعته هتلاقيها في فايل ال Exacalidraw of the checkout comp
// THE RESULT OBJECT OF THIS FUNCTION WILL BE ONE OF THESE CASES:


//✅ 1. الكود صالح وتم تطبيقه
// {
//   "success": true,
//   "message": "تم تطبيق الكود بنجاح",
//   "messageEn": "Promo code applied successfully",
//   "data": {
//     "code": "WELCOME20",
//     "discount": 20,
//     "type": "percentage"
//   }
// }

// ❌ 2. الكود غير موجود
// {
//   "success": false,
//   "message": "الكود غير موجود",
//   "messageEn": "Promo code not found"
// }

// ❌ 3. الكود غير مفعل حاليًا
// {
//   "success": false,
//   "message": "الكود غير نشط حالياً",
//   "messageEn": "Promo code is not active"
// }

// ❌ 4. انتهت صلاحية الكود
// {
//   "success": false,
//   "message": "انتهت صلاحية الكود",
//   "messageEn": "Promo code has expired",
//   "expiry": "2024-12-31T23:59:59Z"
// }

// ❌ 5. اليوزر استخدم الكود من قبل
// {
//   "success": false,
//   "message": "لقد استخدمت هذا الكود من قبل",
//   "messageEn": "You have already used this promo code"
// }

// ❌ 6. الكود وصل للحد الأقصى من الاستخدام
// {
//   "success": false,
//   "message": "وصل الكود للحد الأقصى من الاستخدام",
//   "messageEn": "Promo code has reached maximum usage limit",
//   "max_uses": 100,
//   "current_uses": 100
// }

// ❌ 7. خطأ أثناء تطبيق الكود (DB update failed)
// {
//   "success": false,
//   "message": "حدث خطأ أثناء تطبيق الكود",
//   "messageEn": "Error applying promo code"
// }

// ❌ 8. خطأ داخلي في السيرفر
// {
//   "success": false,
//   "message": "حدث خطأ في الخادم",
//   "messageEn": "Internal server error",
//   "error": "details here"
// }