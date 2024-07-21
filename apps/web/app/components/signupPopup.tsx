import { SignInForm } from "./signInForm"
import { SignUpForm } from "./signUpForm"
import { useSignUpFormStore } from "../store/store"
import { X } from "lucide-react"

export const SignUpPopup = () => {

    const toggleSignUpForm = useSignUpFormStore((state) => state.ToggleSignUp)
    const popUpType = useSignUpFormStore((state) => state.popUpType)
    const setToggleSignUp = useSignUpFormStore((state) => state.setToggleSignUp)

    return (
        <>
            {toggleSignUpForm && (
                <div className="absolute z-50 w-screen h-screen bg-opacity-80 bg-white flex items-center justify-center ">
                    <div className="w-[678px] h-auto bg-white p-4 shadow-lg flex flex-col ">
                        <button className="flex-grow self-end" onClick={setToggleSignUp}>
                            <X />
                        </button>
                        {popUpType == "sign-up" && <SignUpForm />}
                        {popUpType == "sign-in" && <SignInForm />}
                    </div>
                </div>
            )}
        </>
    )
}

