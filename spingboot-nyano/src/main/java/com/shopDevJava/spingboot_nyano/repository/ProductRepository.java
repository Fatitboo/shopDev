package com.shopDevJava.spingboot_nyano.repository;

import com.shopDevJava.spingboot_nyano.entity.ProductEntity;

import java.util.List;

public interface ProductRepository {
    ProductEntity createProduct(ProductEntity product);
    List<ProductEntity> findAllProducts();
}
