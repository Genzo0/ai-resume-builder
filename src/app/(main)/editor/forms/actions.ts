"use server";

import openai from "@/lib/openai";
import { canUseAITools } from "@/lib/permission";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Only premium users can generate resume summary");
  }

  console.log(input);
  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
        You are a job resume generator AI. Your task to write a professional intoduction summary for a resume given the user provided data.
        Only return the summary and do include any other information in the response. Keep it concise and professional 
    `;

  const userMessage = `
        Please generate a professional resume summary from this data:
        Job title: ${jobTitle || "N/A"}
        Work experience : ${workExperiences
          ?.map(
            (exp) => `
            Position : ${exp.position || "N/A"} at
            ${exp.company || "N/A"}
            from ${exp.startDate || "N/A"}
            to ${exp.endDate || "Present"}
            Description : ${exp.description || "N/A"}`,
          )
          .join("\n\n")}

        Education: ${educations
          ?.map(
            (edu) => `
            Position : ${edu.degree || "N/A"} at
            ${edu.school || "N/A"}
            from ${edu.startDate || "N/A"}
            to ${edu.endDate || "N/a"}`,
          )
          .join("\n\n")}

        Skills: ${skills}
    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) throw new Error("Failed to generate summary");

  return aiResponse;
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Only premium users can generate resume summary");
  }

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
    You are a job resume generator AI. Your task to write a professional work experience description for a resume given the user provided data.
    Your response must adhere to the following structure. You can omit fields if they can't be infered from the provided data, but don't add any new ones.

    Job title: <job title>
    Company: <company name>
    Start date: <format: YYYY-MM-DD (only if provided)>
    End date: <format: YYYY-MM-DD (only if provided)>
    Description: <an optimized description in bullet format, might be inferred from the job title>
  `;

  const userMessage = `
    Please generate a professional work experience description from this data:
    ${description}


  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) throw new Error("Failed to generate summary");

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}
