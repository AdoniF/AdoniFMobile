<?php 
/**
 * Main Page template file
**/
get_header(); ?>
<section class="blog-bg">  
  <div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="gg_menu_bg">
      <div class="webpage-container container">
        <div class="gg_menu clearfix">
          <div class="row">
            <div class="col-md-6 col-sm-6">  
              <h1><?php the_title(); ?></h1>
            </div>
            <div class="col-md-6 col-sm-6">  
              <ol class="breadcrumb site-breadcumb">
                <?php if (function_exists('gardenia_custom_breadcrumbs')) gardenia_custom_breadcrumbs(); ?>
              </ol>
            </div>
          </div>

          <?php  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMEEEEEEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNNNNNNNNNNNUUUUUUUUUUUUUU ?>
          <?php getMenu();?>
        </div> 
      </div> <!-- ici -->
    </div>
  </div>

  <div class="container">
    <article class="blog-article clearfix">		

      <div class="col-md-12 blog-right-page col-sm-12">		
       <?php while ( have_posts() ) : the_post();  ?>	
       <div class="blog-main blog_1 ">
         <div class="blog-rightsidebar-img">
           <?php if ( has_post_thumbnail() ) : ?>
           <?php the_post_thumbnail( 'gardenia-sidebar-image-size', array( 'alt' => get_the_title(), 'class' => 'img-responsive gardenia-featured-image') ); ?>
         <?php endif; ?>   						
       </div>
       <div class="blog-data">
        <div class="clearfix"></div>
        <div class="blog-content">
          <?php the_content();
          wp_link_pages( array(
            'before'      => '<div class="col-md-6 col-xs-6 no-padding-lr prev-next-btn">' . __( 'Pages', 'gardenia' ) . ':',
            'after'       => '</div>',
            'link_before' => '<span>',
            'link_after'  => '</span>',
            ) ); ?>         
          </div>
        </div>
      </div> 
      <div class="comments">
        <?php comments_template( '', true ); ?>
      </div>     
    <?php endwhile; ?>                
  </div>

</article>
</div>
</div>  
</section>
<?php get_footer(); ?>

<?php
function getMenu() {
  $options = array();

  array_push($options, '<a href="/recherche/">Recherche par champs</a>');
  array_push($options, '<a href="/consultation-fiches/">Recherche alphabétique</a>');    
  array_push($options, '<a href="/cartographie">Cartographie</a>');

  if (isset($_SESSION['id'])) {
    if ($_SESSION['superAdmin'] == 1) {
      if (($_SESSION['droitSaisie'] == 1) || ($_SESSION['droitAdmin'] == 1)) {
        array_push($options, '<a href ="/creation"> Création/Modification</a>');
        array_push($options, '<a href ="/se-connecter/importationdonnees">Importation Excel</a>');
        array_push($options, '<a href ="/se-connecter/importationfiches">Importation Fiches</a>');
      }
      array_push($options, '<a href="/se-connecter/profil/">Modifier mon profil </a>');

      if($_SESSION['droitSaisie']== 1) { 
        array_push($options, '<a href="/se-connecter/validation/gestion-des-droits/">Gérer les droits</a>');
        array_push($options, '<a href="/se-connecter/gestioninfobulles/">Gérer les infobulles </a>');
        array_push($options, '<a href ="/se-connecter/validation">Validations</a>');
        array_push($options, '<a href="/se-connecter/administration/">Administration </a>');
      }
    } else {
      array_push($options, '<a href="/se-connecter/profil/">Modifier mon profil</a>');
    }
  }
  array_push($options, '<a href="/creation/liste-recoltes-mobiles/">Liste des récoltes mobiles</a>');

  echo "<h4><div class='row'>";
  for ($i = 0; $i < count($options); $i++) {
    echo "<div class='col-xs-3'>".$options[$i]."</div>";
    if (($i + 1)%3 == 0) {
      echo "</div><div class='row'>";
    }
  }
  echo "</div></h4>";
}
?>
