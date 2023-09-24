<?php get_header(); ?>
<?php
while (have_posts()) {
    the_post();
    pageBanner();
?>

    <div class="container container--narrow page-section">
        <div class="metabox metabox--position-up metabox--with-home-link">
            <p><a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('campus') ?>"><i class="fa fa-home" aria-hidden="true"></i> All Campuses</a> <span class="metabox__main"><?php the_title(); ?></p>
        </div>
        <div class="generic-content">
            <?php the_content(); ?>
        </div>

        <?php

        $relatedPrograms = new WP_Query(
            array(
                'posts_per_page' => -1,
                'post_type' => 'program',
                'orderby' => 'title',
                'order' => 'ASC',
                'meta_query' => array(
                    array(
                        'key' => 'related_campus',
                        'compare' => 'LIKE',
                        'value' => '"' . get_the_id() . '"'
                    )
                )
            )
        );

        if ($relatedPrograms->have_posts()) {
            echo '<hr class="section-break">';
            echo '<h2 class="headline headline--medium">Programs Available At This Campus</h2>';
            echo '<ul class="min-list link-list">';
            while ($relatedPrograms->have_posts()) {
                $relatedPrograms->the_post(); ?>
                <li>
                    <a href="<?php the_permalink(); ?>">
                        <?php the_title(); ?>
                    </a>
                </li>
        <?php
            }
            echo '</ul>';
        }

        wp_reset_postdata();

        $today = date('Ymd');
        $homepageEvents = new WP_Query(
            array(
                'posts_per_page' => 2,
                'post_type' => 'event',
                'orderby' => 'meta_value_num',
                'meta_key' => 'event_date',
                'order' => 'ASC',
                'meta_query' => array(
                    array(
                        'key' => 'event_date',
                        'compare' => '>=',
                        'value' => $today,
                        'type' => 'numeric'
                    ),
                    array(
                        'key' => 'related_programs',
                        'compare' => 'LIKE',
                        'value' => '"' . get_the_id() . '"'
                    )
                )
            )
        );

        if ($homepageEvents->have_posts()) {
            echo '<hr class="section-break">';
            echo '<h2 class="headline headline--medium">Upcoming ' . get_the_title() . ' Events</h2>';

            while ($homepageEvents->have_posts()) {
                $homepageEvents->the_post();
                get_template_part('template-parts/content-event');
            }
        }

        ?>
    </div>

<?php }
?>
<?php get_footer(); ?>