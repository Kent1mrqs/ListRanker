export function smoothScrollToElement(elementId: string) {
    console.log("scroll to", elementId)
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({behavior: 'smooth'});
    }
}