import {useState, type ReactNode} from "react";
import {Link, useNavigate, useParams} from "react-router";
import {Controller, useForm, useWatch} from "react-hook-form";
import {ArrowLeft, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Book, BookTag, Localized} from "@/api/types";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {FormInput} from "@/components/form/FormInput";
import {CATEGORY_IDS, CATEGORY_ORNAMENT, ORNAMENTS, type CategoryId, type Ornament} from "@/constants/catalog";
import {buildRoute, NEW_ID, ROUTES} from "@/constants/routes";
import {slugify} from "@/helpers/admin";
import {fromOptionalNumber, toNumber, toOptionalNumber} from "@/helpers/form";
import {useDeleteBook, useSaveBook} from "@/hooks/admin";
import {useGetAuthors} from "@/hooks/authors";
import {useGetBook} from "@/hooks/books";
import {useLanguage} from "@/hooks/useLanguage";
import {BookCover} from "@/widgets/BookCover";
import {OrnamentIcon} from "@/widgets/BookCover/ornaments";
import {ConfirmDialog} from "@/widgets/ConfirmDialog";
import {ImageField} from "@/widgets/ImageField";
import {LocalizedFields} from "@/widgets/LocalizedFields";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";
import {cn} from "@/lib/utils";

type BookForm = {
    id: string;
    authorId: string;
    category: CategoryId;
    title: Localized;
    description: Localized;
    price: string;
    oldPrice: string;
    stock: string;
    pages: string;
    year: string;
    approxYear: boolean;
    ornament: Ornament;
    tag: "" | BookTag;
    coverImage: string;
};

const EMPTY_TEXT: Localized = {az: "", en: "", ru: ""};

const toForm = (book?: Book): BookForm => ({
    id: book?.id ?? "",
    authorId: book?.authorId ?? "",
    category: book?.category ?? "philosophy",
    title: book?.title ?? EMPTY_TEXT,
    description: book?.description ?? EMPTY_TEXT,
    price: book ? String(book.price) : "",
    oldPrice: fromOptionalNumber(book?.oldPrice),
    stock: book ? String(book.stock) : "10",
    pages: book ? String(book.pages) : "",
    year: book ? String(book.year) : "",
    approxYear: Boolean(book?.approxYear),
    ornament: book?.ornament ?? "column",
    tag: book?.tag ?? "",
    coverImage: book?.coverImage ?? "",
});

const fromForm = (form: BookForm): Book => {
    const oldPrice = toOptionalNumber(form.oldPrice);
    return {
        id: form.id.trim(),
        authorId: form.authorId,
        category: form.category,
        title: form.title,
        description: form.description,
        price: toNumber(form.price),
        ...(oldPrice !== undefined && {oldPrice}),
        stock: toNumber(form.stock),
        pages: toNumber(form.pages),
        year: toNumber(form.year),
        ...(form.approxYear && {approxYear: true}),
        ornament: form.ornament,
        ...(form.tag && {tag: form.tag}),
        ...(form.coverImage && {coverImage: form.coverImage}),
    };
};

const selectClass = "h-10 w-full cursor-pointer rounded-lg border border-border bg-surface px-3 text-sm outline-none transition-[border-color] hover:border-border-strong focus:border-foreground";

const Section = ({title, children}: {title: string; children: ReactNode}) => (
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
        <div className="mt-5 grid gap-5">{children}</div>
    </section>
);

const BookEditor = ({book}: {book?: Book}) => {
    const {t} = useTranslation(["admin", "common"]);
    const {pick} = useLanguage();
    const navigate = useNavigate();
    const isNew = !book;
    const {items: authors} = useGetAuthors();
    const save = useSaveBook();
    const remove = useDeleteBook();
    const [confirming, setConfirming] = useState(false);

    const {register, handleSubmit, control, setValue, getFieldState, formState: {errors, isDirty}} = useForm<BookForm>({mode: "onTouched", defaultValues: toForm(book)});
    const values = useWatch({control}) as BookForm;
    const author = authors.find((item) => item.id === values.authorId);
    const required = {validate: (value: string) => value.trim().length > 0 || t("form.required")};
    const number = (rule: (value: number) => boolean, message: string) => ({
        validate: (value: string) => (value.trim() === "" ? t("form.required") : rule(toNumber(value)) || message),
    });

    const submit = handleSubmit((form) => {
        const next = fromForm(form);
        save.mutate({book: next, isNew}, {onSuccess: () => { if (isNew) navigate(buildRoute.adminBook(next.id), {replace: true}); }});
    });

    return (
        <form onSubmit={submit} noValidate className="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="flex min-w-0 flex-col gap-6">
                <Section title={t("books.sections.text")}>
                    <LocalizedFields
                        name="title"
                        label={t("books.fields.title")}
                        register={register}
                        errors={errors}
                    />
                    {isNew && (
                        <FormInput
                            label={t("books.fields.id")}
                            required
                            hint={t("books.idHint")}
                            error={errors.id?.message}
                            {...register("id", {
                                validate: (value) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) || t("form.idFormat"),
                            })}
                            onFocus={() => { if (!getFieldState("id").isDirty && !values.id) setValue("id", slugify(values.title.en || values.title.az)); }}
                        />
                    )}
                    <LocalizedFields name="description" label={t("books.fields.description")} register={register} errors={errors} multiline/>
                </Section>

                <Section title={t("books.sections.catalogue")}>
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2">
                        <label className="flex flex-col gap-1.5 text-[13px] font-medium">
                            <span>{t("books.fields.author")}<span className="ml-0.5 text-accent" aria-hidden>*</span></span>
                            <select className={selectClass} {...register("authorId", required)}>
                                <option value="">{t("form.choose")}</option>
                                {[...authors].sort((a, b) => pick(a.name).localeCompare(pick(b.name))).map((item) => <option key={item.id} value={item.id}>{pick(item.name)}</option>)}
                            </select>
                            {errors.authorId && <span role="alert" className="text-xs font-normal text-danger">{errors.authorId.message}</span>}
                        </label>
                        <label className="flex flex-col gap-1.5 text-[13px] font-medium">
                            {t("books.fields.category")}
                            <select className={selectClass} {...register("category", {onChange: (event) => { if (isNew) setValue("ornament", CATEGORY_ORNAMENT[event.target.value as CategoryId]); }})}>
                                {CATEGORY_IDS.map((id) => <option key={id} value={id}>{t(`common:categories.${id}`)}</option>)}
                            </select>
                        </label>
                        <FormInput label={t("books.fields.year")} required inputMode="numeric" hint={t("books.yearHint")} error={errors.year?.message} {...register("year", number(Number.isInteger, t("form.integer")))}/>
                        <FormInput label={t("books.fields.pages")} required inputMode="numeric" error={errors.pages?.message} {...register("pages", number((value) => Number.isInteger(value) && value > 0, t("form.positiveInteger")))}/>
                    </div>
                    <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm">
                        <input type="checkbox" className="size-4 accent-[var(--accent)]" {...register("approxYear")}/>
                        {t("books.fields.approxYear")}
                    </label>
                    <fieldset>
                        <legend className="mb-2 text-[13px] font-medium">{t("books.fields.tag")}</legend>
                        <div className="flex flex-wrap gap-2">
                            {(["", "bestseller", "new"] as const).map((tag) => (
                                <label key={tag || "none"} className={cn("flex h-9 cursor-pointer items-center rounded-full border px-4 text-[13px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40", values.tag === tag ? "border-accent bg-accent-soft text-accent-bright" : "border-border text-muted-foreground hover:border-border-strong")}>
                                    <input type="radio" value={tag} className="sr-only" {...register("tag")}/>
                                    {tag ? t(`common:tags.${tag}`) : t("books.noTag")}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </Section>

                <Section title={t("books.sections.sale")}>
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-3">
                        <FormInput label={t("books.fields.price")} required inputMode="decimal" error={errors.price?.message} {...register("price", number((value) => value > 0, t("form.positive")))}/>
                        <FormInput
                            label={t("books.fields.oldPrice")}
                            inputMode="decimal"
                            hint={t("books.oldPriceHint")}
                            error={errors.oldPrice?.message}
                            {...register("oldPrice", {validate: (value, form) => value.trim() === "" || toNumber(value) > toNumber(form.price) || t("books.oldPriceRule")})}
                        />
                        <FormInput label={t("books.fields.stock")} required inputMode="numeric" error={errors.stock?.message} {...register("stock", number((value) => Number.isInteger(value) && value >= 0, t("form.nonNegativeInteger")))}/>
                    </div>
                </Section>
            </div>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-20">
                <Section title={t("books.sections.cover")}>
                    <div className="mx-auto w-44 drop-shadow-[0_18px_24px_rgb(var(--shade)/0.45)]">
                        <BookCover book={{id: values.id, title: values.title, category: values.category, ornament: values.ornament, ...(values.coverImage && {coverImage: values.coverImage})}} author={{name: author?.name ?? EMPTY_TEXT}}/>
                    </div>
                    <Controller
                        control={control}
                        name="coverImage"
                        render={({field}) => (
                            <ImageField label={t("books.fields.painting")} hint={t("books.paintingHint")} value={field.value} onChange={field.onChange} folder="covers" name={values.id || "book"} aspect="480 / 546"/>
                        )}
                    />
                    {!values.coverImage && (
                        <fieldset>
                            <legend className="mb-2 text-[13px] font-medium">{t("books.fields.ornament")}</legend>
                            <div className="grid grid-cols-5 gap-1.5">
                                {ORNAMENTS.map((ornament) => (
                                    <label key={ornament} title={ornament} className={cn("flex aspect-square cursor-pointer items-center justify-center rounded-lg border transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40", values.ornament === ornament ? "border-accent bg-accent-soft text-accent-bright" : "border-border text-muted-foreground hover:border-border-strong")}>
                                        <input type="radio" value={ornament} className="sr-only" {...register("ornament")}/>
                                        <OrnamentIcon name={ornament} className="size-6"/>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    )}
                </Section>

                <div className="flex flex-col gap-2">
                    <Button type="submit" variant="accent" size="lg" loading={save.isPending} disabled={!isNew && !isDirty} className="rounded-full">{isNew ? t("books.create") : t("form.save")}</Button>
                    {!isNew && <Button type="button" variant="destructive-ghost" onClick={() => setConfirming(true)}><Trash2/>{t("books.delete")}</Button>}
                </div>
            </aside>

            {book && (
                <ConfirmDialog
                    open={confirming}
                    onOpenChange={setConfirming}
                    title={t("books.deleteTitle")}
                    description={t("books.deleteText", {title: pick(book.title)})}
                    confirmLabel={t("books.delete")}
                    isPending={remove.isPending}
                    onConfirm={() => remove.mutate(book.id, {onSuccess: () => navigate(ROUTES.ADMIN_BOOKS, {replace: true}), onSettled: () => setConfirming(false)})}
                />
            )}
        </form>
    );
};

/** Creates a book (/admin/books/new) or edits one, with the cover redrawn live as the fields change. */
export const AdminBookPage = () => {
    const {t} = useTranslation("admin");
    const {pick} = useLanguage();
    const {bookId = NEW_ID} = useParams();
    const isNew = bookId === NEW_ID;
    const {data: book, isLoading, isError, refetch} = useGetBook(isNew ? undefined : bookId);

    return (
        <section>
            <Link to={ROUTES.ADMIN_BOOKS} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4"/>{t("books.back")}</Link>
            <PageTitle className="mt-4" title={isNew ? t("books.new") : book ? pick(book.title) : t("books.edit")} description={isNew ? t("books.newHint") : book ? `${pick(book.author.name)} · ${book.id}` : undefined}/>
            {isNew ? <BookEditor/>
                : isLoading ? <Skeleton className="mt-8 h-[36rem] rounded-xl"/>
                : isError || !book ? <div className="mt-8"><QueryErrorState onRetry={() => void refetch()}/></div>
                : <BookEditor key={book.id} book={book}/>}
        </section>
    );
};
