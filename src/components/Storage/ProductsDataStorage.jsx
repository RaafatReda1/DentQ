import React, { useEffect, useState } from 'react'
import FetchProducts  from '../../utils/FetchProducts'
function ProductsDataStorage() {
    const [products, setProducts] = useState({
        productsList: null, //stores a list of products' objects from the DB
        productsLoadingState: true //initiate a loading state for products
    })
    useEffect(() => {
        FetchProducts(products, setProducts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return { products, setProducts }

}

export default ProductsDataStorage