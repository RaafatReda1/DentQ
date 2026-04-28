import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import styles from '../ProductCard.module.css';
import RenderProductNameOrDesc from '../../../../../../utils/RenderProductNameOrDesc';

const CardImage = ({ product, mainImage, i18n }) => {
  return (
    <div className={styles.imageWrapper}>
      {mainImage ? (
        <img
          src={mainImage}
          alt={RenderProductNameOrDesc(product, "name", i18n.language)}
          className={styles.productImage}
          loading="lazy"
        />
      ) : (
        <div className={styles.placeholderImage}>
          <ImageIcon size={48} className={styles.placeholderIcon} />
        </div>
      )}
    </div>
  );
};

export default CardImage;
