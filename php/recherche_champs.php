<link type="text/css" rel="stylesheet" href="/lib_js_autocomplete/jquery.autocomplete.css" />
<script type="text/javascript" src="/lib_js_autocomplete/jquery.js"></script>
<script type="text/javascript" src="/lib_js_autocomplete/jquery.autocomplete.js"></script>
<script type="text/javascript" src="/lib_js_autocomplete/script.js"></script>


<div class="row" >
  <h3><span class="label label-success col-md-offset-1 col-sm-offset-1">Consultation (recherche)</span></h3>
</div>

<form action="../vrecherche/" method="get" class="form1 form-horizontal" name="form1">
  <div class="row">
     <label class="control-label col-md-3 col-sm-4 col-xs-12"> Phylum</label>
     <select name ="phylum" id="phylum" class="col-md-4 col-sm-6 col-xs-12">
         <option selected value=""></option>
         <option value="Ascomycota">Ascomycota</option>
         <option value="Basidiomycota">Basidiomycota</option>
         <option value="Zygomycota">Zygomycota</option>
         <option value="Glomeromycota">Glomeromycota</option>
         <option value="Chytridiomycota">Chytridiomycota</option>
         <option value="Mycetozoa">Mycetozoa</option>
    </select>
  </div>
<div class="row">
    <label class="control-label col-md-3 col-sm-4">Genre </label>
    <input id="genre" type="text" name="genre" value=""  onFocus="getGenre(this.value, phylum.value)"  class="col-md-4 col-sm-6 col-xs-12"/>

 <?php //<td> <INPUT TYPE="button" VALUE="Auto" onclick="ComplementInfosRecolte();" class="rechercheAuto"></td> ?>
</div>
<div class="row">
        <label class="control-label col-md-3 col-sm-4 col-xs-12">Espèce </label>
    <input id="epithete" type="text" name="epithete" value="" onFocus ="getEpithete(this.value, genre.value, phylum.value)" class="col-xs-12 col-md-4 col-sm-6" />
</div>
<div class="row">
    <label class="control-label col-md-3 col-sm-4 col-xs-12">Rang intraspécifique </label>
     <select name ="rangintraspec" id="rangintraspec" class="col-md-4 col-sm-6 col-xs-12">
        <option selected value=""></option>
        <option value="var.">var.</option>
        <option value="f.">f.</option>
        <option value="ssp.">ssp.</option>
    </select>
</div>
<div class="row">
    <label class="control-label col-md-3 col-sm-4 col-xs-12">Épithète intraspécifique* </label>
     <input id="taxintraspec" type="text" name="taxintraspec" value="" class="col-md-4 col-sm-6 col-xs-12" />
</div>
<div class="row"><span class="col-md-offset-2 col-md-8 col-sm-offset-2 col-sm-10 col-xs-12" style="font-style: italic; font-size: 12px;">*Le champ Epithete intraspécifique établit la recherche sur l'épithete et sur le rang intraspécifique</span></div>
<div class="row">
    <label class="control-label col-md-3 col-sm-4 col-xs-12">Commune/Domaine </label>
    <input id="commune" type="text" name="commune" value="" class="col-md-4 col-sm-6 col-xs-12" />
</div>
<div class="row">
    <label class="control-label col-md-3 col-sm-4 col-xs-12">Département </label>
    <select name ="departement" id="departement" class="col-md-4 col-sm-6 col-xs-12">
    <option selected value=""></option>
   <?php
       //recherche des départements dans la base de donnée 
  include("connexionBdd/bddinventaire.php");
  $answer = mysql_query("SELECT * FROM departement");
  while ($donnees = mysql_fetch_array($answer) )
  {
  ?>
  <option value="<?php echo $donnees['num']; ?>"><?php echo $donnees['num'].'-'.$donnees['dept']; ?></option>   
  <?php 
  }?> </select> 
</div>
<div class="row">
    <label class="control-label col-md-3 col-sm-4 col-xs-12">Habitat </label>
    <select name ="ecologie" class="col-md-4 col-sm-6 col-xs-12" >
    <option selected value=""></option>
<?php 
include("connexionBdd/bddinventaire.php");

if($answer = mysql_query("SELECT distinct ecologie FROM recolte order by ecologie ASC")) {
    while ($donnees = mysql_fetch_array($answer) ){
     
        echo "<option>".$donnees['ecologie']."</option>";
          
      }
} else {
    echo 'Invalid query: ' . mysql_error() . "\n";
    echo 'Whole query: ' . $query; 
}
?>
</select>
</div>
<div class="row">
  <label class="control-label col-md-3 col-sm-4 col-xs-12">Substrat </label>
  <select name ="substrat" class="col-md-4 col-sm-6 col-xs-12">
     <option selected value=""></option>
  <?php
  include("connexionBdd/bddreferentiel.php");
  $answer = mysql_query("SELECT * FROM substrat " );
  while ($substrat = mysql_fetch_array($answer) )
  { $esp=" ";
          $test=$substrat['code'];
          $i=10;
           while($i<100001){
               $valeur=$test%$i;
              if($valeur!=0){ 
                 $esp.="&ensp;";
              }
              $i=$i*10;
           }
  ?>
  <option value="<?php echo $substrat['libelle']; ?>"><?php  echo $esp.$substrat['libelle']; ?></option>
  <?php 
  }include("connexionBdd/bddinventaire.php");?> </select>
</div>
<div class="row">  
  <label class="control-label col-md-3 col-sm-4 col-xs-12">Hôte </label>
  <select name ="hote" class="col-md-4 col-sm-6 col-xs-12">
     <option selected value=""></option>
      <?php
      $answer = mysql_query("SELECT distinct hote FROM recolte where hote != ' ' order by hote asc" );
      while ($donnees = mysql_fetch_array($answer) )
      {
      ?>
        <option><?php echo $donnees['hote']; ?></option>    
    <?php 
      }
    ?> </select> 
</div>

<div class="row">
  <label class="control-label col-md-3 col-sm-4 col-xs-12">Provenance</label>
  <select name ="hote" class="col-md-4 col-sm-6 col-xs-12">
     <option selected value=""></option>
      <?php
      $answer = mysql_query("SELECT distinct nom FROM asso ORDER BY nom ASC" );
      while ($donnees = mysql_fetch_array($answer) )
      {
      ?>
        <option><?php echo $donnees['nom']; ?></option>    
    <?php 
      }
    ?> </select> 
</div>

<div  class="row">  &nbsp; </div>
<div class="row">
    <div class="col-md-4 col-sm-4 col-xs-4"> <input class="recherche" onclick="this.form.submit()" type="button" value="Recherche" /> </div>
    <div class="col-md-4 col-sm-4 col-xs-4"> <input class="recherche" type="reset" /> </div>
    <div class="col-md-4 col-sm-4 col-xs-4">  
       <?php if(isset($_SESSION['id'])){?> <input class="recherche" onclick="self.location.href='/edition'" type="button" value="Créer" />
       <?php } ?>
    </div>
</div> 
</form>

