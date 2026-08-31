import getUserType from "./getUserRole";

export default function determineHome(type?: string) {
    const uType = type ?? getUserType()
    switch (uType) {
        case "Employee": return "/carownerhome";
        case "Admin": return "/adminhome";
        default: return "/"
    }
}