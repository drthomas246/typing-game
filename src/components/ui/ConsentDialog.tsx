import { Button, Dialog, Portal } from "@chakra-ui/react";

/**
 * 音声利用の許諾を確認するダイアログコンポーネント。
 * このダイアログは、ユーザーにサイトでの音声再生の許可を求めます。
 *
 * @param {object} props - ConsentDialogが受け取るプロパティ。
 * @param {() => void} props.onYes - 「はい」ボタンがクリックされたときに実行されるコールバック関数。
 * @param {() => void} props.onNo - 「いいえ」ボタンがクリックされたときに実行されるコールバック関数。
 * @param {boolean} props.open - ダイアログが表示されているかどうかの状態。
 * @param {(open: boolean) => void} props.onOpenChange - ダイアログの開閉状態が変更されたときに呼び出される関数。
 *
 * @returns {JSX.Element} 音声利用許諾ダイアログ。
 */
export function ConsentDialog({
  onYes,
  onNo,
  open,
  onOpenChange,
}: {
  onYes: () => void;
  onNo: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size="sm"
      placement="center"
      role="alertdialog"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl">
            <Dialog.Header>
              <Dialog.Title>ちゅうい</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              このサイトでは音が鳴ります。よろしいですか？
            </Dialog.Body>
            <Dialog.Footer gap="2">
              <Button colorScheme="teal" onClick={onYes}>
                はい
              </Button>
              <Button variant="outline" onClick={onNo}>
                いいえ
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
