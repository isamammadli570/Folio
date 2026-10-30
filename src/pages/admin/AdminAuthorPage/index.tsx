import {useState, type ReactNode} from "react";
import {Link, useNavigate, useParams} from "react-router";
import {Controller, useForm, useWatch} from "react-hook-form";
import {ArrowLeft, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {AuthorSummary} from "@/api/authors.api";
import type {Author, Localized} from "@/api/types";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {FormInput} from "@/components/form/FormInput";
import {buildRoute, NEW_ID, ROUTES} from "@/constants/routes";
import {slugify} from "@/helpers/admin";
import {fromOptionalNumber, toNumber, toOptionalNumber} from "@/helpers/form";
import {surname} from "@/helpers/format";
import {useDeleteAuthor, useSaveAuthor} from "@/hooks/admin";
import {useGetAuthor} from "@/hooks/authors";
import {useLanguage} from "@/hooks/useLanguage";
import {ConfirmDialog} from "@/widgets/ConfirmDialog";
import {ImageField} from "@/widgets/ImageField";
import {LocalizedFields} from "@/widgets/LocalizedFields";
import {Medallion} from "@/widgets/Medallion";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";

type AuthorForm = {
    id: string;
    name: Localized;
    movement: Localized;
    bio: Localized;
    born: string;
    died: string;
    approx: boolean;
    quoteText: string;
    quoteLang: string;
    quoteTranslation: Localized;
    featured: string;
    portrait: string;
    scene: string;
};

const EMPTY_TEXT: Localized = {az: "", en: "", ru: ""};

const toForm = (author?: Author): AuthorForm => ({
    id: author?.id ?? "",
    name: author?.name ?? EMPTY_TEXT,
    movement: author?.movement ?? EMPTY_TEXT,
    bio: author?.bio ?? EMPTY_TEXT,
    born: author ? String(author.born) : "",
    died: author ? String(author.died) : "",
    approx: Boolean(author?.approx),
    quoteText: author?.quote?.text ?? "",
    quoteLang: author?.quote?.lang ?? "",
    quoteTranslation: author?.quote?.translation ?? EMPTY_TEXT,
    featured: fromOptionalNumber(author?.featured),
    portrait: author?.portrait ?? "",
    scene: author?.scene ?? "",
});

/** A quote is kept only when its text is filled in; the featured slot only when it is a number. */
const fromForm = (form: AuthorForm): Author => {
    const featured = toOptionalNumber(form.featured);
    return {
        id: form.id.trim(),
        name: form.name,
        born: toNumber(form.born),
        died: toNumber(form.died),
        ...(form.approx && {approx: true}),
        movement: form.movement,
        bio: form.bio,
        ...(form.quoteText.trim() && {quote: {text: form.quoteText.trim(), lang: form.quoteLang.trim() || "az", translation: form.quoteTranslation}}),
        ...(featured !== undefined && !Number.isNaN(featured) && {featured}),
        ...(form.portrait && {portrait: form.portrait}),
        ...(form.scene && {scene: form.scene}),
    };
};

const Section = ({title, children}: {title: string; children: ReactNode}) => (
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
        <div className="mt-5 grid gap-5">{children}</div>
    </section>
);

const AuthorEditor = ({author}: {author?: AuthorSummary}) => {
    const {t} = useTranslation("admin");
    const {pick} = useLanguage();
    const navigate = useNavigate();
    const isNew = !author;
    const save = useSaveAuthor();
    const remove = useDeleteAuthor();
    const [confirming, setConfirming] = useState(false);

    const {register, handleSubmit, control, setValue, formState: {errors, isDirty}} = useForm<AuthorForm>({mode: "onTouched", defaultValues: toForm(author)});
    const values = useWatch({control}) as AuthorForm;
    const name = pick(values.name);
    const year = {validate: (value: string) => (value.trim() === "" ? t("form.required") : Number.isInteger(toNumber(value)) || t("form.integer"))};

    const submit = handleSubmit((form) => {
        const next = fromForm(form);
        save.mutate({author: next, isNew}, {onSuccess: () => { if (isNew) navigate(buildRoute.adminAuthor(next.id), {replace: true}); }});
    });

    return (
        <form onSubmit={submit} noValidate className="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="flex min-w-0 flex-col gap-6">
                <Section title={t("authors.sections.person")}>
                    <LocalizedFields name="name" label={t("authors.fields.name")} register={register} errors={errors}/>
                    {isNew && (
                        <FormInput
                            label={t("authors.fields.id")}
                            required
                            hint={t("books.idHint")}
                            error={errors.id?.message}
                            {...register("id", {validate: (value) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) || t("form.idFormat")})}
                            onFocus={() => { if (!values.id) setValue("id", slugify(values.name.en || values.name.az)); }}
                        />
                    )}
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-3">
                        <FormInput label={t("authors.fields.born")} required inputMode="numeric" hint={t("books.yearHint")} error={errors.born?.message} {...register("born", year)}/>
                        <FormInput label={t("authors.fields.died")} required inputMode="numeric" error={errors.died?.message} {...register("died", {...year, validate: (value, form) => year.validate(value) === true ? toNumber(value) > toNumber(form.born) || t("authors.diedRule") : year.validate(value)})}/>
                        <FormInput label={t("authors.fields.featured")} inputMode="numeric" hint={t("authors.featuredHint")} error={errors.featured?.message} {...register("featured", {validate: (value) => value.trim() === "" || Number.isInteger(toNumber(value)) || t("form.integer")})}/>
                    </div>
                    <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm">
                        <input type="checkbox" className="size-4 accent-[var(--accent)]" {...register("approx")}/>
                        {t("authors.fields.approx")}
                    </label>
                    <LocalizedFields name="movement" label={t("authors.fields.movement")} register={register} errors={errors}/>
                    <LocalizedFields name="bio" label={t("authors.fields.bio")} register={register} errors={errors} multiline/>
                </Section>

                <Section title={t("authors.sections.quote")}>
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-[minmax(0,1fr)_8rem]">
                        <FormInput label={t("authors.fields.quote")} hint={t("authors.quoteHint")} {...register("quoteText")}/>
                        <FormInput label={t("authors.fields.quoteLang")} placeholder="grc, la, de…" {...register("quoteLang")}/>
                    </div>
                    <LocalizedFields name="quoteTranslation" label={t("authors.fields.translation")} register={register} errors={errors} required={false}/>
                </Section>
            </div>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-20">
                <Section title={t("authors.sections.images")}>
                    <div className="mx-auto w-40">
                        <Medallion letter={surname(name)[0] ?? "?"} portrait={values.portrait || undefined} alt="" size="lg" className="w-full"/>
                    </div>
                    <Controller control={control} name="portrait" render={({field}) => (
                        <ImageField label={t("authors.fields.portrait")} hint={t("authors.portraitHint")} value={field.value} onChange={field.onChange} folder="authors" name={values.id || "author"}/>
                    )}/>
                    <Controller control={control} name="scene" render={({field}) => (
                        <ImageField label={t("authors.fields.scene")} hint={t("authors.sceneHint")} value={field.value} onChange={field.onChange} folder="scenes" name={values.id || "scene"} aspect="1 / 1"/>
                    )}/>
                </Section>

                <div className="flex flex-col gap-2">
                    <Button type="submit" variant="accent" size="lg" loading={save.isPending} disabled={!isNew && !isDirty} className="rounded-full">{isNew ? t("authors.create") : t("form.save")}</Button>
                    {!isNew && <Button type="button" variant="destructive-ghost" onClick={() => setConfirming(true)}><Trash2/>{t("authors.delete")}</Button>}
                </div>
            </aside>

            {author && (
                <ConfirmDialog
                    open={confirming}
                    onOpenChange={setConfirming}
                    title={t("authors.deleteTitle")}
                    description={author.bookCount > 0 ? t("authors.deleteBlocked", {count: author.bookCount}) : t("authors.deleteText", {name: pick(author.name)})}
                    confirmLabel={t("authors.delete")}
                    isPending={remove.isPending}
                    onConfirm={() => remove.mutate(author.id, {onSuccess: () => navigate(ROUTES.ADMIN_AUTHORS, {replace: true}), onSettled: () => setConfirming(false)})}
                />
            )}
        </form>
    );
};

/** Creates an author (/admin/authors/new) or edits one, with the medallion redrawn live from the portrait. */
export const AdminAuthorPage = () => {
    const {t} = useTranslation("admin");
    const {pick} = useLanguage();
    const {authorId = NEW_ID} = useParams();
    const isNew = authorId === NEW_ID;
    const {data: author, isLoading, isError, refetch} = useGetAuthor(isNew ? undefined : authorId);

    return (
        <section>
            <Link to={ROUTES.ADMIN_AUTHORS} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4"/>{t("authors.back")}</Link>
            <PageTitle className="mt-4" title={isNew ? t("authors.new") : author ? pick(author.name) : t("authors.edit")} description={author ? t("authors.bookCount", {count: author.bookCount}) : undefined}/>
            {isNew ? <AuthorEditor/>
                : isLoading ? <Skeleton className="mt-8 h-[36rem] rounded-xl"/>
                : isError || !author ? <div className="mt-8"><QueryErrorState onRetry={() => void refetch()}/></div>
                : <AuthorEditor key={author.id} author={author}/>}
        </section>
    );
};
