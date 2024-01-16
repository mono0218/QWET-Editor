export type CharacterModelLicenseSerializer = {
    modification: 'default' | 'disallow' | 'allow';
    redistribution: 'default' | 'disallow' | 'allow';
    credit: 'default' | 'necessary' | 'unnecessary';
    characterization_allowed_user: 'default' | 'author' | 'everyone';
    sexual_expression: 'default' | 'disallow' | 'allow';
    violent_expression: 'default' | 'disallow' | 'allow';
    corporate_commercial_use: 'default' | 'disallow' | 'allow';
    personal_commercial_use: 'default' | 'disallow' | 'profit' | 'nonprofit';
};

export type TagSerializer = {
    name: string;
    locale: string | null;
    en_name: string | null;
    ja_name: string | null;
};

export type AgeLimitSerializer = {
    is_r18: boolean;
    is_r15: boolean;
    is_adult: boolean;
}

export type CharacterSerializer = {
    user: UserSerializer;
    id: string;
    name: string;
    is_private: boolean;
    created_at: string;
    published_at: string | null;
};

export type CharacterModelBoothItemSerializer = {
    booth_item_id: number;
    part_category: string | null;
};

export type CharacterModel = {
    id: string;
    name: string | null;
    is_private: boolean;
    is_downloadable: boolean;
    is_comment_off: boolean;
    is_other_users_available: boolean;
    is_other_users_allow_viewer_preview: boolean;
    is_hearted: boolean;
    portrait_image: PortraitImageSerializer;
    full_body_image: FullBodyImageSerializer;
    license?: CharacterModelLicenseSerializer;
    created_at: string;
    heart_count: number;
    download_count: number;
    usage_count: number;
    view_count: number;
    published_at: string | null;
    tags: Array<TagSerializer>;
    age_limit: AgeLimitSerializer;
    character: CharacterSerializer;
    latest_character_model_version?: CharacterModelVersionSerializer;
    character_model_booth_items: Array<CharacterModelBoothItemSerializer>;
}

export type ImageSerializer = {
    url: string;
    url2x: string | null;
    width: number;
    height: number;
};

export type PortraitImageSerializer = {
    is_default_image: boolean;
    original: ImageSerializer;
    w600: ImageSerializer;
    w300: ImageSerializer;
    sq600: ImageSerializer;
    sq300: ImageSerializer;
    sq150: ImageSerializer;
};

export type FullBodyImageSerializer = {
    is_default_image: boolean;
    original: ImageSerializer;
    w600: ImageSerializer;
    w300: ImageSerializer;
};

export type UserIconSerializer = {
    is_default_image: boolean;
    sq170: ImageSerializer;
    sq50: ImageSerializer;
};

export type UserSerializer = {
    id: string;
    pixiv_user_id: string;
    name: string;
    icon: UserIconSerializer;
};

export type CharacterModelVersionSerializer = {
    id: string;
    created_at: string;
    spec_version: string | null;
    exporter_version: string | null;
    triangle_count: number;
    mesh_count: number;
    mesh_primitive_count: number;
    mesh_primitive_morph_count: number;
    material_count: number;
    texture_count: number;
    joint_count: number;
    is_vendor_forbidden_use_by_others: boolean;
    is_vendor_protected_download: boolean;
    is_vendor_forbidden_other_users_preview: boolean;
    original_file_size: number | null;
    vrm_meta: any;
    original_compressed_file_size: number | null;
    conversion_state?: ModelBasisConversionStateSerializer;
    vendor_specified_license?: VendorSpecifiedLicenseSerializer;
    attached_items?: Array<AttachedItemSerializer>;
};

export type ModelBasisConversionStateSerializer = {
    current_state: 'pending' | 'processing' | 'completed' | 'failed';
};

// アプリからのアップロード時に付与されるライセンス情報
export type VendorSpecifiedLicenseSerializer = {
    modification: 'default' | 'disallow' | 'allow';
    redistribution: 'default' | 'disallow' | 'allow';
    credit: 'default' | 'necessary' | 'unnecessary';
    characterization_allowed_user: 'default' | 'author' | 'everyone';
    sexual_expression: 'default' | 'disallow' | 'allow';
    violent_expression: 'default' | 'disallow' | 'allow';
    corporate_commercial_use: 'default' | 'disallow' | 'allow';
    personal_commercial_use: 'default' | 'disallow' | 'profit' | 'nonprofit';
};

// VRoidMobileからのアップロード時に付与される情報
export type AttachedItemSerializer = {
    item_display_name: string;
    category_type:
        | 'skin'
        | 'eyebrow'
        | 'nose'
        | 'mouth'
        | 'ear'
        | 'face_shape'
        | 'lip'
        | 'eye_surrounding'
        | 'eyeline'
        | 'eyelash'
        | 'iris'
        | 'eye_white'
        | 'eye_highlight'
        | 'base_hair'
        | 'all_hair'
        | 'hair_front'
        | 'hair_back'
        | 'whole_body'
        | 'head'
        | 'neck'
        | 'shoulder'
        | 'arm'
        | 'hand'
        | 'chest'
        | 'torso'
        | 'waist'
        | 'leg'
        | 'tops'
        | 'bottoms'
        | 'onepiece'
        | 'shoes'
        | 'inner'
        | 'socks'
        | 'neck_accessory'
        | 'arm_accessory'
        | 'safety'
        | 'cheek';
    downloadable: boolean;
    take_free: boolean;
    id: string;
    attached_item_coins: Array<AttachedItemCoinSerializer>;
};

export type AttachedItemCoinSerializer = {
    coin_type: 'apple' | 'google';
    price: number;
};
