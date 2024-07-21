import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UserSignUpFormSchema } from "@repo/typing/user"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { useSignUpFormStore } from "../store/store"


export const SignUpForm = () => {

    const form = useForm<z.infer<typeof UserSignUpFormSchema>>({
        resolver: zodResolver(UserSignUpFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })

    const onSubmit = (data: z.infer<typeof UserSignUpFormSchema>) => {
        console.log(data)
    }

    const setPopUpType = useSignUpFormStore((state) => (state.setPopUpType))

    const onClickHandler = () => {
        setPopUpType("sign-in")
    }


    return (
        <>
            <h1 className="text-4xl font-noe" >Signup -</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <Button className="rounded-full border-black" type="submit" variant={"outline"}>Sign up</Button>
                        <Button variant={"link"} onClick={onClickHandler}>Already have an account ? sign-in here.</Button>
                    </div>
                </form>
            </Form>
        </>

    )
}

