import React from 'react'
import { 
  CategoryProps, 
  CategoryItemProps 
} from '../../utils/types'

const CategoryItem: React.FC<CategoryItemProps> = ({ href, imgUrl, altText, label }) => (
  <a href={`/products/${href}`} className='text-[12px]'>
    <img src={imgUrl} className='w-full' alt={altText} />
    {label}
  </a>
)

const Category: React.FC<CategoryProps> = ({ title, items }) => (
  <div className='bg-white shadow-xl'>
    <div className='p-4'>
      <p className='text-black font-bold text-xl'>{title}</p>
      <div className='grid grid-cols-2 gap-4 mt-4'>
        {items.map((item, i) => (
          <CategoryItem key={i} {...item} />
        ))}
      </div>
    </div>
  </div>
)

const ShoppingCategory: React.FC = () => {
  const categories: CategoryProps[] = [
    {
      title: 'Viral products you will love',
      items: [
        { href: 'beauty', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/DiscoTec/2022/InternetFamous/Holiday/Gateway/QuadCards/IF_Holiday_OctIF_Beauty_GW_Quadcard_DT_186x116._SY116_CB608673955_.jpg', altText: 'Beauty', label: 'Beauty' },
        { href: 'electronics', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/US-hq/2023/img/Consumer_Electronics/XCM_CUTTLE_1555962_2997449_372x232_2X_en_US._SY232_CB594428687_.jpg', altText: 'Electronics', label: 'Electronics' },
        { href: 'home', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/DiscoTec/2022/InternetFamous/Flips/IF-Holiday/Content/Gateway/QuadCards/Batch2/IF_Holiday_IP_Home_GW_Quadcard_DT_186x116._SY116_CB607016931_.jpg', altText: 'Home', label: 'Home' },
        { href: 'men', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/DiscoTec/2022/InternetFamous/Holiday/Gateway/QuadCards/IF_Holiday_OctIP_MFashion_GW_QC_DT_186x116._SY116_CB608677835_.jpg', altText: "Men's Fashion", label: "Men's Fashion" },
      ],
    },
    {
      title: 'Discover E-Shop Fashion',
      items: [
        { href: 'women', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/AMAZON_FASHION/2023/SITE_FLIPS/SPR23/GW/APRIL/DQC/C1_DQC_April23_generic_WOMEN_372x232._SY232_CB594716668_.jpg', altText: 'Women', label: 'Women' },
        { href: 'men', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/AMAZON_FASHION/2023/SITE_FLIPS/SPR23/GW/APRIL/DQC/C2_DQC_April23_generic_MEN_372x232._SY232_CB594716668_.jpg', altText: "Men's", label: 'Men' },
        { href: 'electronics', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/US-hq/2023/img/Consumer_Electronics/XCM_CUTTLE_1557719_3005621_372x232_2X_en_US._SY232_CB592693583_.jpg', altText: 'Gaming', label: 'Gaming' },
        { href: 'electronics', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/US-hq/2023/img/Consumer_Electronics/XCM_CUTTLE_1556016_2997630_372x232_2X_en_US._SY232_CB594442597_.jpg', altText: 'SmartPhones', label: 'SmartPhones' },
      ],
    },
    {
      title: 'New Arrival Categories',
      items: [
        { href: 'more', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/US-hq/2023/img/Consumables/XCM_CUTTLE_1555934_2997326_372x232_2X_en_US._SY232_CB594435117_.jpg', altText: 'Health & Wellness', label: 'Health & Wellness' },
        { href: 'more', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/US-hq/2023/img/Consumables/XCM_CUTTLE_1555934_2997325_372x232_2X_en_US._SY232_CB594435117_.jpg', altText: "Grocery's", label: "Grocery's" },
        { href: 'more', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/US-hq/2023/img/Consumables/XCM_CUTTLE_1555934_2997327_372x232_2X_en_US._SY232_CB594435117_.jpg', altText: 'Baby', label: 'Baby' },
        { href: 'more', imgUrl: 'https://images-na.ssl-images-amazon.com/images/G/01/sports/raincarlson/2023/SportsOutdoorsBanner/Desktop/2x_Desktop_Quad-Card_C3_cycling._SY232_CB594299291_.jpg', altText: 'Cycling', label: 'Cycling' },
      ],
    },
  ]

  return (
    <section className='bg-gray-100 py-5'>
      <div className='max-w-7xl mx-auto flex justify-center items-center xl:justify-between xl:items-start px-4 2xl:px-0'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
          {categories.map((category, i) => (
            <Category key={i} {...category} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShoppingCategory
