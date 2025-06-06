export const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
        const yOffset = -100; 
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
    }
    element?.classList.add("highlight")
    setTimeout(()=>{
        element?.classList.remove("highlight");
    },1600)
};