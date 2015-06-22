<?php
	include '../connexionBdd/bddreferentiel.php';
	if($_POST['valeur']==EUNIS){
		$answer = mysql_query("SELECT * FROM refeunis " );
	
		while ($habitat = mysql_fetch_array($answer) )
		{ 
            $ecologie=$habitat['LB_EUNIS_FR'];  
           
             $esp=$habitat['CD_EUNIS']." ";
            $test=$habitat['CD_EUNIS'];
            if(strlen($test)>1){
                    $esp.="&ensp;";
                    $chaine=strstr($test,'.');
                    if(strstr($test,'.')){
                        $esp.="&ensp;";
                        for($i=0;$i<strlen($chaine);$i++){
                            $esp.="&ensp;";                                              
                        }
                	}
           	}
	
		if(strlen($test)==1){
           	echo '<li onclick="dropdownEunis(\''.$test.'\');" id="'.$test.'" class="'.$test.'"   >'.$esp.$ecologie.'</li>';

			}else{
			echo '<li onclick="dropdownEunis(\''.$test.'\');" id="'.$test.'" style="display:none;" class="'.$test.'"   >'.$esp.$ecologie.'</li>';
			}
	   }

		
	}
	else if($_POST['valeur']==CORINE){
	    $answer = mysql_query("SELECT * FROM refcorine " );

		while ($habitat = mysql_fetch_array($answer) )
		{ 
	            $ecologie=$habitat['LB_CB97_FR'];                   
	          $esp=$habitat['CD_CB']." ";
	            $test=$habitat['CD_CB'];
	                if(strlen($test)>1){
	                    $esp.="&ensp;";
	                    $chaine=strstr($test,'.');
	                    if(strstr($test,'.')){
	                        $esp.="&ensp;";
	                        for($i=0;$i<strlen($chaine);$i++){
	                            $esp.="&ensp;";                                              
	                        }
	                	}
	           		}
	         

		if(strlen($test)==1){
           	echo '<li onclick="dropdownCorine(\''.$test.'\');" id="'.$test.'" class="'.$test.'"   >'.$esp.$ecologie.'</li>';

			}else{
			echo '<li onclick="dropdownCorine(\''.$test.'\');" id="'.$test.'" style="display:none;" class="'.$test.'"   >'.$esp.$ecologie.'</li>';
			}
	   }

	}
	else if($_POST['valeur']==Phytosocio){
		 $answer = mysql_query("SELECT * FROM refphyto " );

		while ($habitat = mysql_fetch_array($answer) )
		{ 
		
				$test=$habitat['CD_SYNTAXON'];
	             $ecologie=$habitat['LB_SYNTAXON'];                
	          $esp=$habitat['CD_SYNTAXON']." ";
	           	for($i=0;$i<$habitat['NIVEAU'];$i++){
	                $esp.="&ensp;";                                              
	            }
	          
		if(!strstr($test,'.')){
           	echo '<li onclick="dropdownPhytosocio(\''.$test.'\');" id="'.$test.'" class="'.$test.'"   >'.$esp.$ecologie.'</li>';

			}else{
			echo '<li onclick="dropdownPhytosocio(\''.$test.'\');" id="'.$test.'" style="display:none;" class="'.$test.'"   >'.$esp.$ecologie.'</li>';
			}
	   }
	
    }

?>
