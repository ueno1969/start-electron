import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("myAPI", {
    openDialog: async (): Promise<void | string[]> =>
        await ipcRenderer.invoke("open-dialog"),
});
