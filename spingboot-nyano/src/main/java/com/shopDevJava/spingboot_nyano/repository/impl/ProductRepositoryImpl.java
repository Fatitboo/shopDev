package com.shopDevJava.spingboot_nyano.repository.impl;

import com.shopDevJava.spingboot_nyano.entity.ProductEntity;
import com.shopDevJava.spingboot_nyano.repository.ProductRepository;

import java.util.List;

public class ProductRepositoryImpl implements ProductRepository {
    @Override
    public ProductEntity createProduct(ProductEntity product) {
        return null;
    }

    @Override
    public List<ProductEntity> findAllProducts() {
        return List.of();
    }
}
