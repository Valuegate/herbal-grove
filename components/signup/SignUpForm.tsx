import { useForm, type SubmitHandler } from "react-hook-form"
import { GoogleIcon, FacebookIcon } from "../ui/icons"
import { watch } from "fs"

type FormFields = {
  fullname: string,
  email: string,
  password: string,
  confirmPassword: string
}

export const SignUpForm = () => {
  const { 
    register, 
    handleSubmit,
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<FormFields>()

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(data);
  }

  return (
    <div>
      <div className="max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold text-brand-green mb-2">Create Account</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your journey to natural wellness and herbal knowledge starts here
        </p>

        {/* Login Options for Google and Facebook */}
        <div className="bg-[#313131] p-5 rounded-xl mb-6">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="text-[#98989a] text-xs font-medium">Create Account With</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        <div>
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#424242] hover:bg-[#4d4d4d] text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors">
              <GoogleIcon className="w-5 h-5" />
              Sign in with Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors">
              <FacebookIcon className="w-5 h-5" />
              Sign in with Facebook
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-black-300"></div>
          <span className="text-black text-sm">or</span>
          <div className="flex-1 h-px bg-black-300"></div>
        </div>

        {/*Form Section */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Full Name</label>
              <input 
              {...register("fullname", {required: "Fullname is required"})}
              type="text" placeholder="Enter your Full Name"/>
            </div>
            {errors.fullname && (
              <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>)}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Email</label>
              <input 
              {...register("email", {required: "An email is required",
                validate: (value) => {
                  if (!value.includes("@")) {
                    return "Invalid email address"
                  }
                  return true
                }
              })}
              type="email" placeholder="Enter your email"/>
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <input 
              {...register("password", {required: "A password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long"
                }
              })}
              type="password" placeholder="Create Password"/>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Confirm Password</label>
              <input 
              {...register("confirmPassword", {required: "Password is required",
                validate: (value) => {
                  if (value !== watch("password")) {
                    return "Passwords do not match"
                  }
                  return true
                }
              })}
              type="password" placeholder="Confirm Password"/>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}

            <div className="flex items-start gap-2 mb-6 px-1">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer">
                I agree to the <a href="#" className="text-brand-green hover:underline">Terms of Use of Services</a> and <a href="#" className="text-brand-green hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-brand-green hover:bg-[#226324] text-white font-medium py-3 rounded-lg transition-colors mb-4"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-black font-medium">
              Already have an account? <a href="#" className="text-brand-green hover:underline">Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}