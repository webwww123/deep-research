"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Input } from "@/components/ui/input";
import { useGlobalStore } from "@/store/global";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  const { t } = useTranslation();
  const [selectedModel, setSelectedModel] = useState("claude37sonnet");
  const [username, setUsername] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [step, setStep] = useState(1);
  const [useDevAccount, setUseDevAccount] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleModelSelect = () => {
    setStep(2);
  };

  const handlePaymentSubmit = () => {
    if (useDevAccount) {
      onClose(selectedModel, username || "测试用户");
    } else if (cardNumber && expiry && cvc) {
      onClose(selectedModel, username || "匿名用户");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md">
        {step === 1 && (
          <>
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
              <Button onClick={handleModelSelect}>下一步</Button>
            </DialogFooter>
          </>
        )}
        
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">支付与账号信息</DialogTitle>
              <DialogDescription className="pt-2">
                请提供您的支付信息以使用所选模型。
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名（可选）</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="您的显示名称"
                />
              </div>
              
              <div className="flex items-center space-x-2 pb-2 pt-2">
                <input 
                  type="checkbox" 
                  id="useDevAccount" 
                  checked={useDevAccount} 
                  onChange={(e) => setUseDevAccount(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="useDevAccount" className="text-sm font-medium cursor-pointer">
                  使用开发者账号（内测期间免费）
                </Label>
              </div>
              
              {!useDevAccount && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">银行卡号</Label>
                    <Input 
                      id="cardNumber" 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">有效期</Label>
                      <Input 
                        id="expiry" 
                        value={expiry} 
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input 
                        id="cvc" 
                        value={cvc} 
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                返回
              </Button>
              <Button onClick={handlePaymentSubmit} disabled={!useDevAccount && (!cardNumber || !expiry || !cvc)}>
                开始使用
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ModelSelector; 