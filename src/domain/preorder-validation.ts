export const PREORDER_FULL_NAME_MAX_LENGTH = 100;
export const PREORDER_PHONE_PATTERN = /^04[0-9]{8}$/;

const EMOJI_PATTERN = /[\p{Extended_Pictographic}\uFE0F]/u;

export function hasMeaningfulText(value: string) {
  return value.trim().length > 0;
}

export function isValidPreorderFullName(value: string) {
  const trimmedValue = value.trim();

  return (
    trimmedValue.length > 0 &&
    trimmedValue.length <= PREORDER_FULL_NAME_MAX_LENGTH
  );
}

export function isValidPreorderPhone(value: string) {
  return PREORDER_PHONE_PATTERN.test(value);
}

export function containsEmoji(value: string) {
  return EMOJI_PATTERN.test(value);
}
