import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import React from 'react'

function DeleteAlertModal({
  btnText = "Sil",
  cancelBtnText = "İptal",
  title = "Onaylıyor musunuz?",
  text = "Silmek istediğinizden emin misiniz?",
  onClick,
}: {
  btnText?: string;
  title?: string;
  text?: string;
  cancelBtnText?:string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red">{btnText}</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size="2">{text}</AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              {cancelBtnText}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={onClick}>
              {btnText}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

export default DeleteAlertModal
