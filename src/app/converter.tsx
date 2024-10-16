'use client'

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Switch} from "@/components/ui/switch";
import {qrisConverter} from "@/lib/qris-converter";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";

export default function Converter (){
    const [qrisCode, setQrisCode] = useState(process.env.NEXT_PUBLIC_DEFAULT_QRIS_CODE || "");
    const [amount, setAmount] = useState(100000);
    const [feeType, setFeeType] = useState("rupiah");
    const [fee, setFee] = useState(0);
    const [qrisResult, setQrisResult] = useState<undefined | string>(undefined);

    const handleFeeTypeChange = (val : boolean) => {
        setFeeType(val ? "rupiah" : "percent")
    }

    const handleConvert = () => {
        const result = qrisConverter({
            qrisCode: qrisCode,
            amount: amount,
            feeType: fee > 0 ? feeType : undefined,
            fee: fee
        });
        setQrisResult(result);
    }
    return (
        <>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">QRIS Converter</CardTitle>
                    <CardDescription>
                        Convert a static QRIS amount to any amount you want!
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="code">QRIS Code</Label>
                        <Input id="code" type="text" value={qrisCode} onChange={(val) => setQrisCode(val.target.value)}
                               required/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" value={amount}
                               onChange={(val) => setAmount(parseInt(val.target.value))} required/>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="fee-type" defaultChecked={true} onCheckedChange={handleFeeTypeChange} />
                        <Label htmlFor="fee-type">Fee Type</Label>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fee">Fee (In {feeType})</Label>
                        <Input id="fee" type="number" value={fee}
                               onChange={(val) => setFee(parseInt(val.target.value))} required/>
                    </div>
                </CardContent>
                <CardFooter>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button onClick={handleConvert}>Convert</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                                <DialogTitle>Scan</DialogTitle>
                                <DialogDescription>
                                    Please scan with your favourites payment provider
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                    {
                                        qrisResult ? <QRCode
                                            size={256}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            value={qrisResult}
                                            viewBox={`0 0 256 256`}
                                        /> : <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Error</AlertTitle>
                                            <AlertDescription>
                                                Please fill valid value
                                            </AlertDescription>
                                        </Alert>
                                    }

                                </div>
                            </div>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <p className="font-light text-center text-gray-400 text-sm">Tap anywhere to close</p>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </>
    )
}