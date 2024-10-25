export function smoothScrollToElement(elementId: string) {
    console.log("scroll to", elementId)
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({behavior: 'smooth'});
    }
}

export function isValidInput(value: string): boolean {
    const hasInvalidCharacters = /[.,;]/.test(value)
    const input_length = value.trim().length;
    return !hasInvalidCharacters && input_length < 25 && input_length > 0;
}
