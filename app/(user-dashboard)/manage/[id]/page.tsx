// "use client";

// import { AuthGuard } from "@/components/auth/auth-guard";
// import { ManageAdForm } from "@/components/forms/manage-ad-form";
// import { useParams } from "next/navigation";
// import { Breadcrumb } from "@/components/common/breadcrumb";
// import { getCurrentUser } from "@/lib/auth";
// import { useI18n } from "@/providers/lang-provider";

// export default function ManageAdPage() {
//   const { t } = useI18n();
//   const { id } = useParams<{ id: string }>();
//   const user = getCurrentUser();

//   return (
//     // <AuthGuard
//     //   fallback={
//     //     <div className="min-h-screen bg-pattern-grid">
//     //       <div className="container-premium py-8 pt-24">
//     //         <div className="max-w-md mx-auto">
//     //           <div className="ultra-card p-8 text-center">
//     //             <h2 className="text-2xl font-bold text-red-600 mb-4">
//     //               {t("unauthorized")}
//     //             </h2>
//     //             <p className="text-muted-foreground">
//     //               {!user ? t("loginRequiredDesc") : t("noPermissionToManageAd")}
//     //             </p>
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   }
//     // >
//     //   {canManage ? (
//     //     <div className="min-h-screen bg-pattern-grid">
//     //       <div className="container-premium py-8 pt-24">
//     //         <div className="space-y-8">
//     //           <Breadcrumb
//     //             items={[
//     //               { label: t("manageAds"), href: "/manage/ads" },
//     //               { label: ad.companyName },
//     //             ]}
//     //           />
//     //           <ManageAdForm ad={ad} />
//     //         </div>
//     //       </div>
//     //     </div>
//     //   ) : (
//     //     <div className="min-h-screen bg-pattern-grid">
//     //       <div className="container-premium py-8 pt-24">
//     //         <div className="max-w-md mx-auto">
//     //           <div className="ultra-card p-8 text-center">
//     //             <h2 className="text-2xl font-bold text-red-600 mb-4">
//     //               {t("unauthorized")}
//     //             </h2>
//     //             <p className="text-muted-foreground">
//     //               {t("noPermissionToManageAd")}
//     //             </p>
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   )}
//     // </AuthGuard>
//   );
// }

import React from 'react'

const page = () => {
  return (
    <div>
        new page added
    </div>
  )
}

export default page
