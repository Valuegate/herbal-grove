// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { useSignUp } from "@clerk/nextjs";
// import { EyeIcon, EyeSlashIcon } from "../ui/icons";

// type FormFields = {
//   password: string;
//   confirmPassword: string;
// };

// export default function AcceptInvitationForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const ticket = searchParams.get("__clerk_ticket");

//   const signUpData = useSignUp();

//   console.log(signUpData);

//   const [apiError, setApiError] = useState<string | null>(null);

//   const [showPassword, setShowPassword] =
//     useState(false);

//   const [showConfirmPassword, setShowConfirmPassword] =
//     useState(false);

//   const {
//     register,
//     handleSubmit,
//     getValues,
//     formState: { errors, isSubmitting },
//   } = useForm<FormFields>();

//   const onSubmit: SubmitHandler<FormFields> = async (
//     data
//   ) => {
//     if (!ticket) {
//       setApiError("Invalid invitation link.");
//       return;
//     }

//     setApiError(null);

//     try {
//       const result = await signUp.create({
//         strategy: "ticket",
//         ticket,
//         password: data.password,
//       });

//       if (result.createdSessionId) {
//         await setActive({
//           session: result.createdSessionId,
//         });

//         router.replace("/redirect");
//       } else {
//         setApiError(
//           "Unable to complete invitation."
//         );
//       }
//     } catch (err: any) {
//       setApiError(
//         err.errors?.[0]?.longMessage ??
//           err.errors?.[0]?.message ??
//           "Something went wrong."
//       );
//     }
//   };

//   const inputStyle =
//     "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2b7a2d] focus:border-transparent outline-none transition-all text-black text-sm";

//   return (
//     <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
//       <h2 className="mb-2 text-2xl font-bold text-[#2b7a2d]">
//         Accept Invitation
//       </h2>

//       <p className="mb-6 text-sm text-gray-500">
//         Create your password to activate your
//         account.
//       </p>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="space-y-5"
//       >
//         {/* Password */}
//         <div>
//           <label className="mb-1 block text-sm font-medium">
//             Password
//           </label>

//           <div className="relative">
//             <input
//               type={
//                 showPassword ? "text" : "password"
//               }
//               placeholder="••••••••"
//               className={inputStyle}
//               {...register("password", {
//                 required: "Password is required",
//                 minLength: {
//                   value: 8,
//                   message:
//                     "Password must be at least 8 characters",
//                 },
//               })}
//             />

//             <button
//               type="button"
//               onClick={() =>
//                 setShowPassword(!showPassword)
//               }
//               className="absolute right-3 top-3"
//             >
//               {showPassword ? (
//                 <EyeIcon className="h-5 w-5" />
//               ) : (
//                 <EyeSlashIcon className="h-5 w-5" />
//               )}
//             </button>
//           </div>

//           {errors.password && (
//             <p className="mt-1 text-xs text-red-500">
//               {errors.password.message}
//             </p>
//           )}
//         </div>

//         {/* Confirm Password */}
//         <div>
//           <label className="mb-1 block text-sm font-medium">
//             Confirm Password
//           </label>

//           <div className="relative">
//             <input
//               type={
//                 showConfirmPassword
//                   ? "text"
//                   : "password"
//               }
//               placeholder="••••••••"
//               className={inputStyle}
//               {...register("confirmPassword", {
//                 required:
//                   "Please confirm your password",
//                 validate: (value) =>
//                   value === getValues("password") ||
//                   "Passwords do not match",
//               })}
//             />

//             <button
//               type="button"
//               onClick={() =>
//                 setShowConfirmPassword(
//                   !showConfirmPassword
//                 )
//               }
//               className="absolute right-3 top-3"
//             >
//               {showConfirmPassword ? (
//                 <EyeIcon className="h-5 w-5" />
//               ) : (
//                 <EyeSlashIcon className="h-5 w-5" />
//               )}
//             </button>
//           </div>

//           {errors.confirmPassword && (
//             <p className="mt-1 text-xs text-red-500">
//               {errors.confirmPassword.message}
//             </p>
//           )}
//         </div>

//         {apiError && (
//           <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
//             {apiError}
//           </div>
//         )}

//         <button
//           disabled={isSubmitting}
//           type="submit"
//           className="w-full rounded-lg bg-[#2b7a2d] py-3 font-semibold text-white transition hover:bg-[#256927] disabled:opacity-60"
//         >
//           {isSubmitting
//             ? "Creating Account..."
//             : "Accept Invitation"}
//         </button>
//       </form>
//     </div>
//   );
// }