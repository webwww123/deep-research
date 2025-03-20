"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, CircleCheck, TextSearch } from "lucide-react";
import Magicdown from "@/components/Magicdown";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useAccurateTimer from "@/hooks/useAccurateTimer";
import useDeepResearch from "@/hooks/useDeepResearch";
import { useTaskStore } from "@/store/task";

const formSchema = z.object({
  suggestion: z.string(),
});

interface SearchResultProps {
  setActiveStep: (step: string | null) => void;
}

function TaskState({ state }: { state: SearchTask["state"] }) {
  if (state === "completed") {
    return <CircleCheck className="h-5 w-5" />;
  } else if (state === "processing") {
    return <LoaderCircle className="animate-spin h-5 w-5" />;
  } else {
    return <TextSearch className="h-5 w-5" />;
  }
}

function SearchResult({ setActiveStep }: SearchResultProps) {
  const { t } = useTranslation();
  const taskStore = useTaskStore();
  const { status, reviewSearchResult, writeFinalReport } = useDeepResearch();
  const {
    formattedTime,
    start: accurateTimerStart,
    stop: accurateTimerStop,
  } = useAccurateTimer();
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isWriting, setIsWriting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      suggestion: "",
    },
  });

  async function handleWriteFinalReport() {
    // 开始计费 - 最终报告阶段
    setActiveStep("finalReport");
    
    setIsWriting(true);
    await writeFinalReport();
    setIsWriting(false);
    
    // 停止计费 - 最终报告阶段
    setActiveStep(null);
  }

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const { setSuggestion } = useTaskStore.getState();
    setSuggestion(values.suggestion);
    try {
      // 开始计费 - 搜索结果阶段
      setActiveStep("searchResult");
      
      accurateTimerStart();
      setIsThinking(true);
      await reviewSearchResult();
      // Clear previous research suggestions
      setSuggestion("");
      setIsThinking(false);
      
      // 停止计费 - 搜索结果阶段
      setActiveStep(null);
    } finally {
      accurateTimerStop();
    }
  }

  return (
    <section className="p-4 border rounded-md mt-4">
      {taskStore.tasks.length === 0 ? (
        <div>{t("research.searchResult.emptyTip")}</div>
      ) : (
        <div>
          <Accordion className="mb-4" type="single" collapsible>
            {taskStore.tasks.map((item, idx) => {
              return (
                <AccordionItem key={idx} value={item.query}>
                  <AccordionTrigger>
                    <div className="flex">
                      <TaskState state={item.state} />
                      <span className="ml-1">{item.query}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-slate dark:prose-invert">
                    <Magicdown>
                      {[
                        `> ${item.researchGoal}`,
                        item.learning,
                        item.sources?.length > 0
                          ? `\n\n#### ${t(
                              "research.common.sources"
                            )}\n\n${item.sources
                              .map(
                                (source) =>
                                  `- [${source.title || source.url}](${
                                    source.url
                                  })`
                              )
                              .join("\n")}`
                          : "",
                      ].join("\n\n")}
                    </Magicdown>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="suggestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 font-semibold">
                      {t("research.searchResult.suggestionLabel")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder={t(
                          "research.searchResult.suggestionPlaceholder"
                        )}
                        disabled={isThinking}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4 max-sm:gap-2 w-full mt-4">
                <Button type="submit" className="bg-secondary hover:bg-secondary/80" disabled={isThinking}>
                  {isThinking ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      <span className="mx-1">{status}</span>
                      <small className="font-mono">{formattedTime}</small>
                    </>
                  ) : (
                    t("research.common.continueResearch")
                  )}
                </Button>
                <Button
                  disabled={isWriting}
                  onClick={() => handleWriteFinalReport()}
                >
                  {isWriting ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      <span className="mx-1">{status}</span>
                    </>
                  ) : (
                    t("research.common.writeReport")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </section>
  );
}

export default SearchResult;
