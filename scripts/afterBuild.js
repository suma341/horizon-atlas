import { rm } from "fs/promises";

(async()=>
    await rm("tmp", { recursive: true, force: true })
)()

