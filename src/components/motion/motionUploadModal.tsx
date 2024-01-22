"use client"
import {Image} from "@nextui-org/react";
import {Input} from "@nextui-org/input";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export default function MotionUploadModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const onSubmit = async (event)=>{
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const response = await fetch('/api/motion', {
            method: 'POST',
            body: formData,
        })
    }

    return (
        <>
            <Button onPress={onOpen} color="primary">新しく投稿する</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="p-10">
                                <h1 className="text-4xl font-bold text-center pb-5">モーションを投稿する</h1>

                                <div>
                                    <form onSubmit={onSubmit}　className="grid gap-4 items-center">
                                        <Image
                                            className="w-full"
                                            alt="NextUI hero Image"
                                            src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                                        />
                                        <Input
                                            isRequired
                                            type="file"
                                            name="image"
                                        />

                                        <Input
                                            isRequired
                                            type="name"
                                            label="作品名"
                                            name="name"
                                        />

                                        <Input
                                            isRequired
                                            type="content"
                                            label="説明文"
                                            name="content"
                                        />

                                        <Input
                                            isRequired
                                            type="license"
                                            label="ライセンス"
                                            name="license"
                                        />

                                        <Input
                                            isRequired
                                            type="file"
                                            name="file"
                                        />

                                        <Button type="submit">投稿する</Button>

                                    </form>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
