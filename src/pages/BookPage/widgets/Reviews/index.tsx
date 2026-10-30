import {useState, type CSSProperties} from "react";
import {Link, useLocation} from "react-router";
import {PenLine, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Review} from "@/api/reviews.api";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {Textarea} from "@/components/ui/textarea";
import {ROUTES} from "@/constants/routes";
import {formatDate} from "@/helpers/format";
import {useCanReview, useDeleteReview, useGetReviews, useSaveReview} from "@/hooks/reviews";
import {useAuth} from "@/hooks/useAuth";
import {useLanguage} from "@/hooks/useLanguage";
import {StarPicker, Stars} from "@/widgets/Stars";

const REVIEW_MAX = 2000;

type ReviewFormProps = {
    bookId: string;
    review?: Review;
    onDone: () => void;
};

const ReviewForm = ({bookId, review, onDone}: ReviewFormProps) => {
    const {t} = useTranslation("catalog");
    const [rating, setRating] = useState(review?.rating ?? 0);
    const [body, setBody] = useState(review?.body ?? "");
    const save = useSaveReview();

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                if (rating === 0) return;
                save.mutate({bookId, rating, body, reviewId: review?.id}, {onSuccess: onDone});
            }}
            className="animate-fade-up flex flex-col gap-4 border border-accent/40 bg-accent-soft/30 p-5"
        >
            <div>
                <p className="mb-2 text-[13px] font-medium">{t("reviews.yourRating")}</p>
                <StarPicker value={rating} onChange={setRating}/>
            </div>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium">
                {t("reviews.yourReview")}
                <Textarea rows={4} maxLength={REVIEW_MAX} value={body} onChange={(event) => setBody(event.target.value)} placeholder={t("reviews.placeholder")} className="font-normal"/>
            </label>
            <div className="flex flex-wrap gap-2">
                <Button type="submit" variant="accent" className="rounded-full px-6" disabled={rating === 0} loading={save.isPending}>{review ? t("reviews.update") : t("reviews.publish")}</Button>
                <Button type="button" variant="ghost" onClick={onDone}>{t("reviews.cancel")}</Button>
            </div>
        </form>
    );
};

/** What readers who bought the book thought of it: the average, the spread of stars, the reviews, and a form for buyers. */
export const Reviews = ({bookId}: {bookId: string}) => {
    const {t} = useTranslation("catalog");
    const {language} = useLanguage();
    const {pathname} = useLocation();
    const {user} = useAuth();
    const {items: reviews, isLoading} = useGetReviews(bookId);
    const {data: mayReview} = useCanReview(bookId);
    const remove = useDeleteReview(bookId);
    const [isWriting, setIsWriting] = useState(false);

    const mine = reviews.find((review) => review.userId === user?.id);
    const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
    const spread = [5, 4, 3, 2, 1].map((star) => ({star, count: reviews.filter((review) => review.rating === star).length}));

    return (
        <section id="reviews" className="mt-24 scroll-mt-24">
            <p className="eyebrow">{t("reviews.eyebrow")}</p>
            <h2 className="mt-3 font-serif text-[clamp(30px,3.6vw,44px)]">{t("reviews.title")}</h2>

            <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
                <div>
                    {reviews.length > 0 ? (
                        <>
                            <p className="tabular font-display text-6xl leading-none">{average.toFixed(1)}</p>
                            <Stars value={average} size={18} className="mt-3"/>
                            <p className="mt-2 text-sm text-muted-foreground">{t("reviews.count", {count: reviews.length})}</p>
                            <ul className="mt-5 flex flex-col gap-1.5">
                                {spread.map(({star, count}) => (
                                    <li key={star} className="grid grid-cols-[1.25rem_minmax(0,1fr)_1.5rem] items-center gap-2 text-xs text-muted-foreground">
                                        <span className="tabular">{star}</span>
                                        <span className="h-1.5 overflow-hidden rounded-full bg-border"><span className="block h-full rounded-full bg-accent" style={{width: `${(count / reviews.length) * 100}%`}}/></span>
                                        <span className="tabular text-right">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : !isLoading && <p className="font-serif text-xl text-muted-foreground">{t("reviews.none")}</p>}

                    <div className="mt-6">
                        {!user ? (
                            <p className="text-sm text-muted-foreground">
                                <Link to={`${ROUTES.LOGIN}?next=${encodeURIComponent(`${pathname}#reviews`)}`} className="text-accent underline underline-offset-4 hover:text-accent-bright">{t("reviews.signIn")}</Link> {t("reviews.signInHint")}
                            </p>
                        ) : mayReview && !mine && !isWriting ? (
                            <Button variant="outline" className="rounded-full" onClick={() => setIsWriting(true)}><PenLine/>{t("reviews.write")}</Button>
                        ) : !mayReview && !mine ? (
                            <p className="text-sm text-muted-foreground">{t("reviews.buyersOnly")}</p>
                        ) : null}
                    </div>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                    {isWriting && <ReviewForm bookId={bookId} review={mine} onDone={() => setIsWriting(false)}/>}
                    {isLoading ? [0, 1].map((key) => <Skeleton key={key} className="h-28"/>) : reviews.map((review, index) => (
                        <article key={review.id} className="animate-fade-up border-b border-border pb-5" style={{animationDelay: `${index * 60}ms`} as CSSProperties}>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <Stars value={review.rating}/>
                                <span className="font-serif text-[17px]">{review.authorName || t("reviews.reader")}</span>
                                {review.userId === user?.id && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] text-accent-bright">{t("reviews.yours")}</span>}
                                <span className="ml-auto text-xs text-faint-foreground">{formatDate(review.createdAt, language)}</span>
                            </div>
                            {review.body && <p className="mt-2.5 whitespace-pre-line font-serif text-[17px] leading-relaxed text-muted-foreground">{review.body}</p>}
                            {review.userId === user?.id && !isWriting && (
                                <div className="mt-3 flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => setIsWriting(true)}><PenLine/>{t("reviews.edit")}</Button>
                                    <Button variant="destructive-ghost" size="sm" loading={remove.isPending} onClick={() => remove.mutate(review.id)}><Trash2/>{t("reviews.delete")}</Button>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
