import LoadingComponent from "@/components/LoadingComponent.vue";
import type { AsyncComponentLoader, AsyncComponentOptions } from "vue";
export const asyncWithLoader = (
    loader: AsyncComponentLoader,
    options?: Omit<AsyncComponentOptions, "loader" | "loadingComponent">,
): AsyncComponentOptions => ({
    loader,
    loadingComponent: LoadingComponent,
    ...options,
});
