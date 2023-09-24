<?php 
get_header(); 
pageBanner(array(
    'title' => 'Our Campuses',
    'subtitle' => 'We have several conveniently located campuses.'
))
?>
<div class="container container--narrow page-section">
    <?php
    while (have_posts()) {
        the_post();
        echo paginate_links();
    }
    ?>
</div>
<?php get_footer(); ?>