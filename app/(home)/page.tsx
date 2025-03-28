import { Card, CardContent } from "@/components/ui/card";
import { HomeCard } from "@/components/ui/shared/home/home-card";
import { HomeCarousel } from "@/components/ui/shared/home/home-carousel";
import ProductSlider from "@/components/ui/shared/product/product-slider";

import data from "@/lib/data";
import { getAllCategories, getProductsByTag, getProductsForCard } from "@/lib/db/actions/product.actions";
import { toSlug } from "@/lib/utils";


export default async function Page() {
  const categories = (await getAllCategories()).slice(0, 4)
  const newArrivals = await  getProductsForCard({
    tag: 'new-arrival',
    limit: 4
  })
  const featureds = await  getProductsForCard({
    tag: 'featured',
    limit: 4
  })
  const bestSellers = await getProductsForCard({
    tag: 'best-seller',
    limit: 4
  })
  const cards = [
    {
      title: 'Categories to explore',
      link: {
        text: "See More",
        href: "/search",  
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`
      }))
    },
    {
      title: "Explore New Arrivals",
      items: newArrivals,  // ✅ Correct key
      link: {
        text: "See More",
        href: "/search?tag=new-arrival",
      },
    },
    {
      title: "Discover Best Sellers",
      items: bestSellers,  // ✅ Fixed "itmes" to "items"
      link: {
        text: "See More",
        href: "/search?tag=best-seller",  // ✅ Corrected tag
      }
    },
    {
      title: "Featured Products",
      items: featureds,  // ✅ Correct key
      link: {
        text: "Shop Now",
        href: "/search?tag=featured",  // ✅ Corrected tag
      },
    },
  ];

  const todayDeals = await getProductsByTag({tag: 'todays-deal'})

  const bestSellingProducts = await getProductsByTag({tag: 'best-seller'})
  

  return (
    <>
    <HomeCarousel items={data.carousels} />
  <div className="md:p-4 md:space-y-4 bg-border">
    <HomeCard cards={cards}/>

    <Card className="w-full rounded-none">
      <CardContent className="p-4 items-center gap-3">
        <ProductSlider title={"Today's Deals"} products={todayDeals}/>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4 items-center gap-3">
        <ProductSlider 
        title={"Best Selling Products"} 
        products={bestSellingProducts}
        hideDetails
        />
      </CardContent>
    </Card>

  </div>
    </>
  )
}

