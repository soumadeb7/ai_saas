import { useTRPC } from "@/trpc/client";
import { AgentsGetOne } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@base-ui/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { agentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface AgentFromProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentsGetOne;
};

export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: AgentFromProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                );

                if (initialValues?.id){
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id })
                    );
                }
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);

                //Todo: check if error code is "FORBIDDEN", redirect to "/upgrade"
            },
        }),
    );

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? "",
        },
    });

    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending;

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            console.log("TODO: updateAgent")
        } else {
            createAgent.mutate(values);
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar
                    seed={form.watch("name")}
                    variant="botttsNeutral"
                    className="border size-16"
                />
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g John" />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    name="instructions"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="You are a helpful math assistant"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex justify-content gap-x-50">
                    {onCancel && (
                        <Button
                            variant="ghost"
                            disabled={isPending}
                            type="button"
                            onClick={() => onCancel()}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button disabled={isPending} type="submit">
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    )
};
