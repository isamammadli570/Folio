import {useState} from "react";
import {useGetAuthors, useGetFeaturedAuthors} from "@/hooks/authors";
import {AuthorSpotlight} from "@/pages/HomePage/widgets/AuthorSpotlight";
import {AuthorWorks} from "@/pages/HomePage/widgets/AuthorWorks";
import {AuthorMarquee} from "@/pages/HomePage/widgets/AuthorMarquee";
import {CategoryTiles} from "@/pages/HomePage/widgets/CategoryTiles";
import {FeaturedShelf} from "@/pages/HomePage/widgets/FeaturedShelf";
import {QuoteBand} from "@/pages/HomePage/widgets/QuoteBand";

/** The front hall: an author in the spotlight and their books, the four sections, the shelf and an epigraph. */
export const HomePage = () => {
    const {items: featured, isLoading} = useGetFeaturedAuthors();
    const {items: authors} = useGetAuthors();
    const [index, setIndex] = useState(0);

    return (
        <div className="animate-fade-in">
            <AuthorSpotlight authors={featured} isLoading={isLoading} index={index} onIndexChange={setIndex}/>
            <AuthorWorks author={featured[index]}/>
            <CategoryTiles/>
            <FeaturedShelf/>
            <QuoteBand/>
            <AuthorMarquee authors={authors}/>
        </div>
    );
};
