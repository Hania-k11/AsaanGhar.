CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFilteredPropertiesByFields`(
    IN p_location TEXT,
    IN p_min_bedrooms INT,
    IN p_max_bedrooms INT,
    IN p_bedrooms INT,
    IN p_min_bathrooms INT,
    IN p_max_bathrooms INT,
    IN p_bathrooms INT,
    IN p_min_area DECIMAL(10,2),
    IN p_max_area DECIMAL(10,2),
    IN p_area DECIMAL(10,2),
    IN p_min_price DECIMAL(15,2),
    IN p_max_price DECIMAL(15,2),
    IN p_price DECIMAL(15,2),
    IN p_listing_type_name VARCHAR(255),
    IN p_property_type_name VARCHAR(255),
    IN p_furnishing_status_name VARCHAR(255),
    IN p_floor VARCHAR(255),
    IN p_lease_duration VARCHAR(50),
    IN p_min_maintenance_fee DECIMAL(15,2),
    IN p_max_maintenance_fee DECIMAL(15,2),
    IN p_maintenance_fee DECIMAL(15,2),
    IN p_min_deposit DECIMAL(15,2),
    IN p_max_deposit DECIMAL(15,2),
    IN p_deposit DECIMAL(15,2),
    IN p_min_year_built INT,
    IN p_max_year_built INT,
    IN p_year_built INT,
    IN p_amenities TEXT,
    IN p_user_id INT
)
BEGIN
    SELECT
        p.property_id,
        p.owner_id,
        p.title,
        p.description,
        p.price,
        p.address,
        p.street_address,
        l.area AS location_name,
        l.city AS location_city,
        lt.name AS listing_type_name,
        pt.name AS property_type_name,
        p.bedrooms,
        p.bathrooms,
        p.area_sqft,
        fs.name AS furnishing_status_name,
        p.floor,
        p.lease_duration,
        p.available_from,
        p.maintenance_fee,
        p.deposit,
        p.year_built,
        p.views,
        p.inquiries,
        p.days_listed,
        p.status,
        p.nearby_places,
        p.is_featured,
        p.posted_at,
        p.updated_at,
        p.created_by,
        p.updated_by,
        p.is_deleted,
        p.latitude,
        p.longitude,
        GROUP_CONCAT(DISTINCT a.name ORDER BY a.name SEPARATOR ', ') AS amenities,
        -- Get all images with main image first
        GROUP_CONCAT(
            DISTINCT CONCAT(pi.image_id, ':', pi.image_url, ':', pi.is_main)
            ORDER BY pi.is_main DESC, pi.image_id ASC
            SEPARATOR '||'
        ) AS images,
        c.contact_id,
        c.contact_name,
        c.contact_email,
        c.contact_phone,
        c.contact_whatsapp,
        pc.pref_email,
        pc.pref_phone,
        pc.pref_whatsapp
    FROM properties p
    LEFT JOIN listing_types lt ON p.listing_type_id = lt.listing_type_id
    LEFT JOIN property_types pt ON p.property_type_id = pt.property_type_id
    LEFT JOIN furnishing_statuses fs ON p.furnishing_status_id = fs.furnishing_status_id
    LEFT JOIN locations l ON p.location_id = l.location_id
    LEFT JOIN property_amenities pa ON p.property_id = pa.property_id
    LEFT JOIN amenities a ON pa.amenity_id = a.amenity_id
    LEFT JOIN property_contacts pc ON p.property_id = pc.property_id
    LEFT JOIN contacts c ON pc.contact_id = c.contact_id
    -- Changed: Remove the is_main = 1 filter to get ALL images
    LEFT JOIN property_images pi ON p.property_id = pi.property_id
    LEFT JOIN users u ON p.owner_id = u.user_id
    LEFT JOIN user_settings us ON u.user_id = us.user_id
    WHERE
        p.is_deleted = 0
        AND us.show_listings = TRUE
        AND u.cnic_verified = 1
        AND u.phone_verified = 1
        AND p.approval_status = 'approved'
        AND (p_location IS NULL OR
         FIND_IN_SET(LOWER(TRIM(l.area)), LOWER(TRIM(p_location))) > 0 OR
         FIND_IN_SET(LOWER(TRIM(l.city)), LOWER(TRIM(p_location))) > 0)
    AND (
             (p_bedrooms IS NULL AND (
                 (p_min_bedrooms IS NULL OR p.bedrooms >= p_min_bedrooms)
                 AND (p_max_bedrooms IS NULL OR p.bedrooms <= p_max_bedrooms)
             ))
             OR (p_bedrooms IS NOT NULL AND p.bedrooms = p_bedrooms)
        )
    AND (
             (p_bathrooms IS NULL AND (
                 (p_min_bathrooms IS NULL OR p.bathrooms >= p_min_bathrooms)
                 AND (p_max_bathrooms IS NULL OR p.bathrooms <= p_max_bathrooms)
             ))
             OR (p_bathrooms IS NOT NULL AND p.bathrooms = p_bathrooms)
        )
    AND (
             (p_area IS NULL AND (
                 (p_min_area IS NULL OR p.area_sqft >= p_min_area)
                 AND (p_max_area IS NULL OR p.area_sqft <= p_max_area)
             ))
             OR (p_area IS NOT NULL AND p.area_sqft = p_area)
        )
    AND (
             (p_price IS NULL AND (
                 (p_min_price IS NULL OR p.price >= p_min_price)
                 AND (p_max_price IS NULL OR p.price <= p_max_price)
             ))
             OR (p_price IS NOT NULL AND p.price = p_price)
        )
    AND (
             (p_maintenance_fee IS NULL AND (
                 (p_min_maintenance_fee IS NULL OR p.maintenance_fee >= p_min_maintenance_fee)
                 AND (p_max_maintenance_fee IS NULL OR p.maintenance_fee <= p_max_maintenance_fee)
             ))
             OR (p_maintenance_fee IS NOT NULL AND p.maintenance_fee = p_maintenance_fee)
        )
    AND (
             (p_deposit IS NULL AND (
                 (p_min_deposit IS NULL OR p.deposit >= p_min_deposit)
                 AND (p_max_deposit IS NULL OR p.deposit <= p_max_deposit)
             ))
             OR (p_deposit IS NOT NULL AND p.deposit = p_deposit)
        )
    AND (
             (p_year_built IS NULL AND (
                 (p_min_year_built IS NULL OR p.year_built >= p_min_year_built)
                 AND (p_max_year_built IS NULL OR p.year_built <= p_max_year_built)
             ))
             OR (p_year_built IS NOT NULL AND p.year_built = p_year_built)
        )
    AND (p_listing_type_name IS NULL OR FIND_IN_SET(TRIM(lt.name), p_listing_type_name) > 0)
    AND (p_property_type_name IS NULL OR FIND_IN_SET(TRIM(pt.name), p_property_type_name) > 0)
    AND (p_furnishing_status_name IS NULL OR FIND_IN_SET(TRIM(fs.name), p_furnishing_status_name) > 0)
    AND (p_floor IS NULL OR FIND_IN_SET(TRIM(p.floor), p_floor) > 0)
    AND (p_lease_duration IS NULL OR FIND_IN_SET(TRIM(p.lease_duration), p_lease_duration) > 0)
    AND (p_user_id IS NULL OR p.owner_id <> p_user_id)
    GROUP BY p.property_id
    HAVING
        (p_amenities IS NULL OR
         NOT EXISTS (
             SELECT 1
             FROM (
                 SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_amenities, ',', numbers.n), ',', -1)) AS amenity
                 FROM (
                     SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
                     UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
                 ) numbers
                 WHERE numbers.n <= 1 + LENGTH(p_amenities) - LENGTH(REPLACE(p_amenities, ',', ''))
             ) AS required_amenities
             WHERE FIND_IN_SET(required_amenities.amenity, GROUP_CONCAT(a.name)) = 0
         )
        );
END