<?php
	//error_reporting(E_ALL);
	//ini_set('display_errors', '1');
	$max_string_length=30;
	session_start();
	require '../../connexionBdd/bddInventaire.php';
	if($bdd&&isset($_GET['latitude'])&&isset($_GET['longitude'])){
		$latitude=$_GET['latitude'];
		$longitude=$_GET['longitude'];
		$champignon=$_GET['champignon'];
		$lieu=$_GET['lieu'];
		$gps=$_GET['gps'];
		mysqli_query($bdd,"SET NAMES 'utf8'");//permet d'éviter la casse sur les accents notamment
		$columns=array("id","genre","epithete","rangintraspec","taxintraspec","date_recolte","departement","domaine","sous_domaine","lieu_dit","localite","gps_longitude","gps_latitude","leg","rayon","qte_sur_rayon");
		//$query="SELECT DISTINCT ".implode(',',$columns)." FROM recolte WHERE gps_latitude=".$latitude." AND gps_longitude=".$longitude." AND CONCAT_WS(' ',GENRE,EPITHETE,NULLIF(RANGINTRASPEC,''),NULLIF(TAXINTRASPEC,'')) LIKE '".$champignon."%' GROUP BY genre,epithete";
		$query="";
		if($lieu!="")$query="SELECT DISTINCT ".implode(',',$columns)." FROM recolte WHERE gps_latitude=".(($gps=="1")?0:$latitude)." AND gps_longitude=".(($gps=="1")?0:$longitude)." AND ( localite LIKE '".$lieu."' ) GROUP BY genre,epithete";
		if($champignon!="")$query="SELECT DISTINCT ".implode(',',$columns)." FROM recolte WHERE gps_latitude=".(($gps=="1")?0:$latitude)." AND gps_longitude=".(($gps=="1")?0:$longitude)." AND CONCAT_WS(' ',GENRE,EPITHETE,NULLIF(RANGINTRASPEC,''),NULLIF(TAXINTRASPEC,'')) LIKE '".$champignon."%' GROUP BY genre,epithete";
		/**echo '<pre>';
		var_dump($_GET);
		echo '</pre>';
		echo $query;**/
		if($query!="")$tmp=mysqli_query($bdd,$query);
	}
?>
<head>
	<!-- Charset UTF-8 -->
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<!-- JQuery -->
	<link href="../../ajax/jquery.autocomplete.css" rel="stylesheet" type="text/css"></link>
	<script src="../../ajax/jquery-1.11.1.min.js" type="text/javascript"></script>
	<script src="../../ajax/script.js" type="text/javascript"></script>
	<!-- Scripts PPJ -->
	<script src="../js/imageLens.js" type="text/javascript"></script>
	<script src="../js/confLoader.js" type="text/javascript"></script>
	<!-- CSS -->
	<link href="../css/carte.css" rel="stylesheet" type="text/css">
	<link href="../css/default.css" rel="stylesheet" type="text/css">
	<script>
		//var globales
		var zoom=5;
		var highLightedImage=0;
	</script>
</head>
<body>
	<?php $count=0;$array=array();while($result=mysqli_fetch_array($tmp)) : $array[$count]=$result['genre']." ".$result['epithete']." ".$result['rangintraspec']." ".$result['taxintraspec'];?>
	<div id="det<?php echo $count; ?>" hidden><center>
		<table class="info">
			<tr>
				<td>Espèce</td>
				<td>Commune</td>
				<td>Domaine</td>
				<td>Coordonnées
					<?php if($gps=="1") : ?>
						<img style="vertical-align:middle" src="../img/infobulle.png" onClick="$('#tooltip_gps').toggle();"/>
					<?php endif; ?>
				</td>
				<?php if(intval($result['rayon'])+1>0)echo '<td>Rayon(m)</td>'; ?>
				<td>Quantité</td>
				<td>Date récolte</td>
			</tr>
			<tr>
				<td id="esp"><?php echo $result['genre']." ".$result['epithete']." ".$result['rangintraspec']." ".$result['taxintraspec'];?></td>
				<td id="com"><?php echo $result['localite']."(".$result['departement'].")"; ?></td>
				<td id="dom">
					<?php 
						if($result['sous_domaine']!=""){
							//découpe le domaine en sous-chaines pour éviter un tableau à rallonge
							if(strlen($result['domaine']."(".$result['sous_domaine'].")")<$max_string_length){
								echo $result['domaine']."(".$result['sous_domaine'].")";
							}else if(strlen($result['domaine'])>$max_string_length){
								$length=strlen($result['domaine']);
								$tmp=explode(' ',$result['domaine']);
								$tmp1="";$i=0;
								//s'arrête dès que le premier segment de la chaine dépasse la longueur de la moitié de la chaine
								while(strlen($tmp1)<$length/2&&$i<count($tmp)){
									$tmp1.=$tmp[$i].' ';
									$i++;
								}
								$tmp2="";
								while($i<count($tmp)){
									$tmp2.=$tmp[$i].' ';
									$i++;
								}
								//$tmp1 et $tmp2 sont les deux moitiés de la chaine
								echo $tmp1."</br>".$tmp2."</br>(".$result['sous_domaine'].")";
							}else{
								echo $result['domaine']."</br>(".$result['sous_domaine'].")";
							}
						}else if($result['domaine']!=""){
							echo $result['domaine'];
						}else{
							echo '<font size=1.75em color=red><i>Domaine non défini</i></font>';
						} 
					?>
				</td>
				<td id="coo">
					<center>
						<div style="display:table-row">
							<div style="display:table-cell;text-align:center">Longitude</div><div style="display:table-cell;text-align:center">Latitude</div>
						</div>
						<div style="display:table-row">
							<div style="display:table-cell"><?php echo $longitude; ?></div><div style="display:table-cell"><?php echo $latitude; ?></div>
						</div>
						<?php if($gps=="1") : ?>
							<span id="tooltip_gps" hidden><em>
							Ces coordonnées GPS</br>
							ont été estimées à partir</br>
							des données géographiques</br>
							relatives à cette récolte</br>
							leur précision est donc</br>
							très approximative
						</em></span>
					<?php endif; ?>
					</center>
				</td>
				<?php if(intval($result['rayon'])+1>0)echo '<td id="ray">'.$result['rayon'].'</td>'; ?>
				<td><?php echo $result['qte_sur_rayon']; ?></td>
				<td id="dat"><?php echo $result['date_recolte']; ?></td>
			</tr>
		</table><!-- Lien possible vers la page perso de l'auteur -->
		<h4><i>Auteur de la récolte et de ses photographies : </i><?php if($result['leg']!=""){echo $result['leg'];}else{echo "Inconnu";} ?></h3>
		<div id="photo_hint" hidden>
			<em>Cliquez une première fois sur l'une des photos pour l'aggrandir, une seconde fois pour la réduire</em></br>
			<em>Passer votre curseur sur l'une des photos pour voir les commentaires de l'auteur</em>
		</div>
		<table class="info">
			<script type="text/javascript">
				function photo(id){
					if($('#test<?php echo $count; ?>').is(':hidden')){
						img=document.getElementById(id);
						if(img.src.split('/')[img.src.split('/').length-1]!='noPhoto.png'){
							copy=document.createElement('img');
							copy.src=img.src;
							copy.width=img.width*zoom;
							copy.height=img.height*zoom;
							var test=document.getElementById('test<?php echo $count; ?>');
							test.removeChild(test.lastChild);
							test.appendChild(copy);
							copy.onload=function(){
								$(copy).imageLens({lensSize:128,borderSize:3,borderColor:'#888888'});
								$('#infos', window.parent.document).height(window.parent.document.body.scrollHeight+'px');
							};
							$('#test<?php echo $count; ?>').show();
						}
					}else{
						var test=document.getElementById('test<?php echo $count; ?>');
						test.removeChild(test.lastChild);
						$(test).hide();
					}
				}
			</script>
			<?php
				$photo_query="SELECT * FROM recolte_photos WHERE recolt_id='".$result['id']."'";
				//tof url : http://inventaire.dbmyco.fr/wp-content/uploads/photos_recoltes/user'id'/recolte'id'
				$photo_query=mysqli_query($bdd,$photo_query);
				$photo_count=0;
				$row_nb=0;
				while($photo_result=mysqli_fetch_array($photo_query)){
					$photo_URL='http://inventaire.dbmyco.fr/wp-content/uploads/photos_recoltes/user'.$photo_result['user_id'].'/recolte'.$photo_result['recolt_id'].'/'.$photo_result['nom'];
					$photo_count++;
					if($row_nb==0||(($photo_count-1)/4-$row_nb)>0){
						$row_nb++;
						if($row_nb>0){echo "</tr>";}else{echo "<script type='text/javascript'>$('#photo_hint').show();</script>";}
						echo "<tr>";
							//Affiche les photos de la récolte, s'il y en a
							//Affiche les commentaires associés à celles-ci lors du survol
							//Zoom sur la photo sur laquelle l'utilisateur clique, chaque clic suivant le premier sur la même photo augmentera le zoom
							//v3
						echo "<td class='imgWrap'>
							<image id='photo".$photo_count."' src='".(($photo_result['nom']!=null)?$photo_URL:'../img/test.JPG')."' alt='Photo n°".$photo_count."' width='128' height='128'/>
							<p class='imgDescription' onclick='photo(\"photo".$photo_count."\")'>Aucun commentaire</p>
						</td>";
					}else{
						//Affiche les photos de la récolte, s'il y en a
						//Affiche les commentaires associés à celles-ci lors du survol
						//Zoom sur la photo sur laquelle l'utilisateur clique, chaque clic suivant le premier sur la même photo augmentera le zoom
						//v3
						echo "<td class='imgWrap'>
								<image id='photo".$photo_count."' src='".(($photo_result['nom']!=null)?$photo_URL:'../img/test.JPG')."' alt='Photo n°".$photo_count."' width='128' height='128'/>
								<p class='imgDescription' onclick='photo(\"photo".$photo_count."\")'>Aucun commentaire</p>
							</td>";
					}
				}
				echo "</tr>";
			?>
		</table>
		<div id="test<?php echo $count++; ?>" hidden>
		<div><em>Cliquez sur l'une des photos ci-dessus pour la cacher</em></br><em>Survoler la ci-dessous pour utiliser la loupe</em></div>
		<div></div></div>
	</center></div>
	<?php endwhile; ?>
	<?php if($count>1) : ?>
	<!-- Boutons pour changer de récolte dans le cas d'une liste-->
	<center>
		<strong>Plusieurs récoltes ont été trouvées à ces coordonnées, vous pouvez consulter chacune de leurs fiches ci-dessous</strong>
		<table>
			<script type="text/javascript">
				var idx=0;var max=0;
			</script>
			<tr>
				<td><input id="first" class="button" type="button" onclick="highLight(-2);$(this).focus();" value=" << " disabled /></td>
				<td><input id="previous" class="button" type="button" onclick="highLight(-1);$(this).focus();" value=" <  " disabled /></td>
				<td><input id="page_count" class="button" type="button" value="<?php echo $count; ?>" disabled /></td>
				<td><input id="next" class="button" type="button" onclick="highLight(+1);$(this).focus();" value="  > " autofocus /></td>
				<td><input id="last" class="button" type="button" onclick="highLight(+2);$(this).focus();" value=" >> "/></td>
			</tr>
			<script type="text/javascript">
				max=parseInt(document.getElementById("page_count").value)-1;
				document.getElementById("page_count").value=(idx+1)+"/"+(max+1);
				$('#det'+idx).show();
				if(max>0){$('#next').show();$('#last').show();}
				function highLight(change){
					if(change==-2)change=-idx;
					if(change==+2){if(max==0){change=(parseInt(document.getElementById("page_count").value)-1)-idx;}else{change=max-idx;}}
					$('#det'+idx).hide();
					idx=idx+change;
					$('#cardSelector').val(idx+1);
					$('#option1').value=idx;
					$('#det'+idx).show();
					if(idx==0){$('#previous').attr('disabled','disabled');$('#first').attr('disabled','disabled');}
					if(idx>0){$('#previous').removeAttr('disabled');$('#first').removeAttr('disabled');}
					if(idx<max){$('#next').removeAttr('disabled');$('#last').removeAttr('disabled');}
					if(idx==max){$('#next').attr('disabled','disabled');$('#last').attr('disabled','disabled');}
					document.getElementById("page_count").value=(idx+1)+"/"+(max+1);
				}
			</script>
		</table>
		<select id="cardSelector" onchange="if(idx>this.value){highLight(-(idx-this.value-1));}else{highLight(this.value-1-idx);}">
			<option value="1" selected ><?php echo '1-'.$array[0]; ?></option>
			<?php $i=2;while($i<=$count) : ?>
				<option value="<?php echo $i; ?>"><?php echo $i.'-'.$array[$i-1]; ?></option>
			<?php $i++;endwhile; ?>
		</select><!--  Liste des champignons des récoltes trouvées -->
	</center>
	<?php else : ?>
		<script type="text/javascript">$('#det0').show();</script>
	<?php endif; ?>
	<p style="font-size:70%;text-align:center">Pour toute information, veuillez contacter le coordonnateur de projet <a href="mailto:pierre-arthur.moreau@univ-lille2.fr">Pierre-Arthur Moreau</a></p>
</body>