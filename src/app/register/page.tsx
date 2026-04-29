"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  age: z.number().min(18, "You must be 18 to vote").max(120),
  isFirstTimeVoter: z.boolean(),
  location: z.string().min(2, "Please provide a valid location"),
  preferredLanguage: z.string().min(2),
  voiceEnabled: z.boolean(),
});
type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isFirstTimeVoter, setIsFirstTimeVoter] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 18,
      isFirstTimeVoter: true,
      location: "",
      preferredLanguage: "en",
      voiceEnabled: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/v1/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Unable to save your onboarding details");
      }

      router.push("/learning");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while saving profile"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto p-4 w-full h-screen flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome Student Voter!</CardTitle>
          <CardDescription>
            Tell us a bit about yourself so we can personalize your learning journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="18"
                {...register("age", { valueAsNumber: true })}
              />
              {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Delhi, India" {...register("location")} />
              <p className="text-sm text-gray-500">Where do you plan to vote?</p>
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>

            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <Checkbox
                id="isFirstTimeVoter"
                checked={isFirstTimeVoter}
                onCheckedChange={(checked) => {
                  const nextValue = checked === true;
                  setIsFirstTimeVoter(nextValue);
                  setValue("isFirstTimeVoter", nextValue, {
                    shouldValidate: true,
                  });
                }}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="isFirstTimeVoter">First Time Voter</Label>
                <p className="text-sm text-gray-500">Check this if you have never voted before.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <select
                {...register("preferredLanguage")}
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="gu">Gujarati</option>
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={() => setValue("voiceEnabled", true, { shouldValidate: true })}
              >
                Enable Voice Assistant
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? "Saving..." : "Start Learning"}
              </Button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
