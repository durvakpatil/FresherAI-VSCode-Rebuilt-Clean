import { generateRoadmap as generateRoadmapFn, toggleRoadmapTopic as toggleRoadmapTopicFn, } from "@/services/roadmapApi";
/** Form-action adapter so the agent UI can keep using `useActionState`. */
export async function generateRoadmap(_prev, formData) {
    try {
        return await generateRoadmapFn({
            data: {
                goal: String(formData.get("goal") ?? ""),
                currentLevel: String(formData.get("currentLevel") ?? "beginner"),
                weeks: parseInt(String(formData.get("weeks") ?? "8"), 10) || 8,
            },
        });
    }
    catch (err) {
        console.error("[fresherai] generateRoadmap request failed", err);
        return { status: "error", message: "You must be signed in to generate a roadmap." };
    }
}
export async function toggleRoadmapTopic(roadmapId, weekIndex, topicIndex) {
    try {
        await toggleRoadmapTopicFn({ data: { roadmapId, weekIndex, topicIndex } });
    }
    catch (err) {
        console.error("[fresherai] toggleRoadmapTopic failed", err);
    }
}
