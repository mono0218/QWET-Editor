"use client";
import { Image } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function UserContentUpdateModal({ id }: { id: number }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { push } = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/user/${id}`, {
      method: "PUT",
      body: formData,
    });

    const result = await response.json();

    if (result.status === 200) {
      push(`/users/${id}`);
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="primary">
        プロフィール文を更新する
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalBody className="p-10">
                <h1 className="text-4xl font-bold text-center pb-5">
                  プロフィール文を更新する
                </h1>

                <div>
                  <form onSubmit={onSubmit} className="grid gap-4 items-center">
                    <Image
                      className="w-full"
                      alt="NextUI hero Image"
                      src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                    />
                    <Textarea
                      type="content"
                      label="プロフィール文"
                      name="content"
                    />

                    <Button type="submit">更新する</Button>
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
