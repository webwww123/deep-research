"use client";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// 模型数据
const models = [
  { 
    id: "gpt45", 
    name: "GPT-4.5", 
    description: "高级大语言模型，拥有卓越的创造力和推理能力",
    inputPrice: 75,
    outputPrice: 150,
  },
  { 
    id: "claude37sonnet", 
    name: "Claude 3.7 Sonnet", 
    description: "平衡速度和智能的高级模型，编码能力出色",
    inputPrice: 3,
    outputPrice: 15,
  },
  { 
    id: "claude37max", 
    name: "Claude 3.7 Max", 
    description: "顶级推理模型，提供深度思考和复杂问题解决",
    inputPrice: 15,
    outputPrice: 75,
  },
  { 
    id: "claude35sonnet", 
    name: "Claude 3.5 Sonnet", 
    description: "快速响应，适合日常任务和轻量级分析",
    inputPrice: 3, 
    outputPrice: 15,
  },
  { 
    id: "gpt4o", 
    name: "GPT-4o", 
    description: "OpenAI的多模态模型，具有出色的图像理解能力",
    inputPrice: 2.5,
    outputPrice: 10,
  }
];

type ModelSelectorProps = {
  open: boolean;
  onClose: (selectedModel?: string, username?: string) => void;
};

function ModelSelector({ open, onClose }: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState("claude37sonnet");
  
  const handleClose = () => {
    onClose();
  };

  const handleModelSelect = () => {
    // 直接提交选择的模型，使用默认用户名
    onClose(selectedModel, "测试用户");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">选择AI模型</DialogTitle>
          <DialogDescription className="pt-2">
            选择您想要使用的AI模型。不同模型有不同的特点和定价。
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedModel} onValueChange={setSelectedModel}>
            {models.map(model => (
              <div key={model.id} className="flex items-start space-x-2 mb-4">
                <RadioGroupItem value={model.id} id={model.id} className="mt-1" />
                <div className="grid gap-1.5 w-full">
                  <Label htmlFor={model.id} className="font-medium flex justify-between">
                    <span>{model.name}</span>
                    <span className="text-green-600 font-bold">${model.inputPrice}-${model.outputPrice}/百万token</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button onClick={handleModelSelect}>开始使用</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModelSelector; 