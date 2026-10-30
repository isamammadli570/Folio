import {useId, useRef} from "react";
import {ImagePlus, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";
import type {MediaFolder} from "@/api/admin.api";
import {Button} from "@/components/ui/button";
import {useUploadMedia} from "@/hooks/admin";
import {cn} from "@/lib/utils";

const MAX_BYTES = 3 * 1024 * 1024;
const TYPES = ["image/webp", "image/jpeg", "image/png"];

type ImageFieldProps = {
    label: string;
    hint?: string;
    value: string;
    onChange: (url: string) => void;
    folder: MediaFolder;
    /** Base of the stored file name, usually the record's id. */
    name: string;
    /** Width / height of the preview frame. */
    aspect?: string;
    className?: string;
};

/** Picks an image, uploads it to Storage straight away and hands back its public URL. Keeps the old image until then. */
export const ImageField = ({label, hint, value, onChange, folder, name, aspect = "4 / 5", className}: ImageFieldProps) => {
    const {t} = useTranslation("admin");
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const upload = useUploadMedia();

    const pick = (file: File | undefined) => {
        if (!file) return;
        if (!TYPES.includes(file.type)) return void toast.error(t("errors.imageType"));
        if (file.size > MAX_BYTES) return void toast.error(t("errors.imageSize"));
        upload.mutate({file, folder, name: name || "image"}, {onSuccess: onChange});
    };

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <label htmlFor={inputId} className="text-[13px] font-medium">{label}</label>
            <div className="flex items-start gap-4">
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                        event.preventDefault();
                        pick(event.dataTransfer.files[0]);
                    }}
                    style={{aspectRatio: aspect}}
                    className={cn(
                        "relative flex w-32 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-border-strong bg-surface text-muted-foreground outline-none transition-colors hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-ring/40",
                        upload.isPending && "animate-pulse",
                    )}
                >
                    {value ? <img src={value} alt="" className="absolute inset-0 size-full object-cover"/> : <ImagePlus className="size-6 stroke-[1.4]"/>}
                </button>
                <div className="flex min-w-0 flex-col gap-2 pt-1">
                    <input
                        ref={inputRef}
                        id={inputId}
                        type="file"
                        accept={TYPES.join(",")}
                        className="sr-only"
                        onChange={(event) => {
                            pick(event.target.files?.[0]);
                            event.target.value = "";
                        }}
                    />
                    <Button type="button" variant="outline" size="sm" loading={upload.isPending} onClick={() => inputRef.current?.click()}>
                        <ImagePlus/>{value ? t("form.replaceImage") : t("form.uploadImage")}
                    </Button>
                    {value && <Button type="button" variant="destructive-ghost" size="sm" onClick={() => onChange("")}><Trash2/>{t("form.removeImage")}</Button>}
                    <p className="text-xs leading-relaxed text-muted-foreground">{hint ?? t("form.imageHint")}</p>
                </div>
            </div>
        </div>
    );
};
